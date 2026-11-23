import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust proxy for accurate client IP rate-limiting behind Cloud Run / reverse proxies
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// ============================================================================
// 1. HTTP Security Headers Middleware
// ============================================================================
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection', '0');
  // Note: frame-ancestors is intentionally omitted so the preview iframe works cleanly,
  // while script/object/base restrictions harden against XSS & plugin injection.
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://i.ytimg.com https://drive.google.com https://lh3.googleusercontent.com https:",
      "media-src 'self' blob: https://assets.mixkit.co https:",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://drive.google.com https://player.vimeo.com https://www.instagram.com",
      isProd
        ? "connect-src 'self' https://script.google.com https://script.googleusercontent.com"
        : "connect-src 'self' ws: wss: https://script.google.com https://script.googleusercontent.com",
    ].join('; ')
  );
  next();
});

// ============================================================================
// 2. Simple In-Memory Rate Limiter (protects public booking endpoint from spam)
// ============================================================================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        error: 'Too many requests. Please wait a few minutes before submitting again.',
      });
      return;
    }

    record.count += 1;
    next();
  };
}

// Sanitize Google Sheets cell values against formula injection (=, +, -, @)
function sanitizeCell(value: unknown, maxLen = 400): string {
  const str = String(value ?? '').trim().slice(0, maxLen);
  if (!str) return '';
  return /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
}

function getWebhookConfig() {
  return {
    url: (process.env.GOOGLE_SHEETS_WEBHOOK_URL || '').trim(),
    secret: (process.env.GOOGLE_SHEETS_SECRET || '').trim(),
  };
}

// ============================================================================
// 3. Secure Server-Side Google Sheets Proxy Endpoints (/api/sheets/*)
//    Keeps GOOGLE_SHEETS_WEBHOOK_URL & GOOGLE_SHEETS_SECRET strictly on server
// ============================================================================

app.get('/api/health', (_req: Request, res: Response) => {
  const { url } = getWebhookConfig();
  res.json({ ok: true, sheetsProxyConfigured: Boolean(url) });
});

// Public read of portfolio items (strictly no-store to prevent stale portfolio cache)
app.get('/api/sheets/portfolio', async (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { url, secret } = getWebhookConfig();
  if (!url) {
    res.json({ reels: [], configured: false });
    return;
  }

  try {
    const sep = url.includes('?') ? '&' : '?';
    const target = `${url}${sep}action=get_portfolio&t=${Date.now()}${secret ? `&secret=${encodeURIComponent(secret)}` : ''}`;
    const response = await fetch(target, { cache: 'no-store' });
    if (!response.ok) {
      res.status(502).json({ error: 'Upstream Google Sheets read failed', reels: [] });
      return;
    }
    const data = await response.json();
    res.json({ reels: Array.isArray(data.reels) ? data.reels : [], configured: true });
  } catch (err) {
    console.error('Portfolio Sheet GET failed:', err);
    res.status(502).json({ error: 'Could not reach Google Sheets', reels: [] });
  }
});

// Public append-only booking submission (rate-limited, honeypot-checked, sanitized)
app.post('/api/sheets/bookings', rateLimit(8, 10 * 60 * 1000), async (req: Request, res: Response) => {
  const body = req.body || {};

  // Honeypot anti-bot field: silently accept without forwarding if a bot fills it
  if (body.website) {
    res.json({ synced: true });
    return;
  }

  const fullName = sanitizeCell(body.fullName, 120);
  const phone = sanitizeCell(body.phone, 40);
  const location = sanitizeCell(body.location, 300);

  if (!fullName || !phone || !location) {
    res.status(400).json({ error: 'Missing required booking fields (fullName, phone, location).' });
    return;
  }

  const { url, secret } = getWebhookConfig();
  if (!url) {
    res.json({ synced: false, reason: 'server_webhook_not_configured' });
    return;
  }

  const safePayload = {
    action: 'append_booking',
    bookingId: sanitizeCell(body.bookingId, 40),
    timestamp: sanitizeCell(body.timestamp || new Date().toISOString(), 60),
    fullName,
    phone,
    email: sanitizeCell(body.email, 120),
    city: sanitizeCell(body.city, 80),
    eventType: sanitizeCell(body.eventType, 100),
    eventDate: sanitizeCell(body.eventDate, 40),
    preferredTime: sanitizeCell(body.preferredTime, 80),
    package: sanitizeCell(body.package, 120),
    price: Number(body.price) || 0,
    location,
    specialRequirements: sanitizeCell(body.specialRequirements || 'None', 500),
    status: 'Pending',
    ...(secret ? { secret } : {}),
  };

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safePayload),
    });
    res.json({ synced: upstream.ok });
  } catch (err) {
    console.error('Booking Sheet POST failed:', err);
    res.status(502).json({ synced: false, error: 'Failed to append booking row' });
  }
});

// Admin booking status update (updates ONLY matching bookingId row)
app.post('/api/sheets/bookings/status', rateLimit(30, 5 * 60 * 1000), async (req: Request, res: Response) => {
  const { url, secret } = getWebhookConfig();
  if (!url) {
    res.json({ synced: false });
    return;
  }

  const body = req.body || {};
  const allowedStatuses = new Set(['Pending', 'Approved', 'Rejected', 'Completed']);
  if (!body.bookingId || !allowedStatuses.has(body.status)) {
    res.status(400).json({ error: 'Invalid bookingId or status' });
    return;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_booking_status',
        bookingId: sanitizeCell(body.bookingId, 40),
        status: body.status,
        adminNotes: sanitizeCell(body.adminNotes || '', 500),
        ...(secret ? { secret } : {}),
      }),
    });
    res.json({ synced: upstream.ok });
  } catch (err) {
    console.error('Booking status update failed:', err);
    res.status(502).json({ synced: false });
  }
});

// Admin portfolio append / update-row / delete-row proxy
app.post('/api/sheets/portfolio', rateLimit(40, 5 * 60 * 1000), async (req: Request, res: Response) => {
  const { url, secret } = getWebhookConfig();
  if (!url) {
    res.json({ synced: false });
    return;
  }

  const body = req.body || {};
  const allowedActions = new Set(['append_reel', 'update_reel', 'delete_reel']);
  if (!allowedActions.has(body.action) || !body.id) {
    res.status(400).json({ error: 'Invalid portfolio action or missing id' });
    return;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: body.action,
        id: sanitizeCell(body.id, 80),
        title: sanitizeCell(body.title || '', 160),
        thumbnail: sanitizeCell(body.thumbnail || '', 500),
        videoUrl: sanitizeCell(body.videoUrl || '', 500),
        views: sanitizeCell(body.views || '', 60),
        location: sanitizeCell(body.location || '', 160),
        category: sanitizeCell(body.category || '', 80),
        order: Number(body.order) || 1,
        isActive: body.isActive !== false,
        updatedAt: sanitizeCell(body.updatedAt || new Date().toISOString(), 60),
        ...(secret ? { secret } : {}),
      }),
    });
    res.json({ synced: upstream.ok });
  } catch (err) {
    console.error('Portfolio Sheet POST failed:', err);
    res.status(502).json({ synced: false });
  }
});

// ============================================================================
// 4. Mount Vite Dev Server or Production Static Build
// ============================================================================
// Zero-WebSocket Vite dev client shim: Vite 8 injects /@vite/client even when
// hmr/ws are disabled, which tries to connect to ws://<host>:24678 and throws
// an unhandled "WebSocket closed without opened." rejection behind proxies.
const NO_HMR_VITE_CLIENT_JS = `
const sheetsMap = new Map();

export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
  } else {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}

export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
    sheetsMap.delete(id);
  }
}

export function createHotContext(_ownerPath) {
  const noop = () => {};
  return {
    data: {},
    accept: noop,
    acceptExports: noop,
    dispose: noop,
    prune: noop,
    decline: noop,
    invalidate: noop,
    on: noop,
    off: noop,
    send: noop,
  };
}

export function injectQuery(url, queryToInject) {
  if (url[0] !== '.' && url[0] !== '/') {
    return url;
  }
  const pathname = url.replace(/[?#].*$/, '');
  const { search, hash } = new URL(url, 'http://vite.dev');
  return pathname + '?' + queryToInject + (search ? '&' + search.slice(1) : '') + (hash || '');
}

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
export class ErrorOverlay extends BaseElement {}
`.trimStart();

async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });
    app.get('/@vite/client', (_req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.send(NO_HMR_VITE_CLIENT_JS);
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reels Brozz server running on http://localhost:${PORT}`);
  });
}

startServer();
