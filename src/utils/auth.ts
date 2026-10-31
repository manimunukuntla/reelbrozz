import { PLATFORM_CONFIG } from './constants';

const AUTH_SESSION_KEY = 'reelsbrozz_admin_auth_token';

export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  return input.trim() === PLATFORM_CONFIG.adminPassword;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'authenticated_mani_7';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (authenticated) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'authenticated_mani_7');
    } else {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch (err) {
    console.error('SessionStorage error:', err);
  }
}

export function logoutAdmin(): void {
  setAdminAuthenticated(false);
}
