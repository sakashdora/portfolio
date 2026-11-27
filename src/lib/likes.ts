/**
 * Page likes.
 *
 * Each visitor's like is remembered in localStorage and also sent to
 * /api/likes (see server/likes.ts), which keeps one like per anonymous browser
 * id and returns the shared total. If the endpoint isn't available (for
 * example Redis isn't connected yet) the button still works for the visitor
 * and simply shows no total, so no number is ever made up.
 * VITE_LIKES_API can point at a different endpoint with the same contract:
 *   GET -> { count }      POST { id, liked } -> { count }
 */
const LIKED_KEY = 'portfolio:liked';
const ID_KEY = 'portfolio:visitor';
const API = (import.meta.env.VITE_LIKES_API ?? '').trim() || '/api/likes';

function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value);
  } catch { /* private mode: nothing is persisted */ }
}

export const readLiked = () => read(LIKED_KEY) === '1';
export const storeLiked = (liked: boolean) => write(LIKED_KEY, liked ? '1' : null);

/** A random, anonymous id for this browser (no personal data). */
function visitorId(): string {
  const existing = read(ID_KEY);
  if (existing && /^[A-Za-z0-9-]{16,64}$/.test(existing)) return existing;
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 10)).join('-');
  write(ID_KEY, id);
  return id;
}

async function request(init?: RequestInit): Promise<number | null> {
  try {
    const response = await fetch(API, { ...init, headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) return null;
    const data = (await response.json()) as { count?: unknown };
    return typeof data.count === 'number' && Number.isFinite(data.count) ? Math.max(0, Math.round(data.count)) : null;
  } catch {
    return null;
  }
}

export const fetchLikeCount = () => request();
/** Records (or removes) this visitor's like. Safe to repeat: it never double counts. */
export const sendLike = (liked: boolean) => request({ method: 'POST', body: JSON.stringify({ id: visitorId(), liked }) });
