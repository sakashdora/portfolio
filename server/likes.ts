/**
 * Shared like counter: the logic behind /api/likes.
 *
 * Likes live in a set of anonymous visitor ids (random ids generated in each
 * visitor's browser). The count is the size of the set, so liking twice from
 * the same browser can't inflate it and un-liking really removes the like.
 * No IP addresses or personal data are stored.
 */

export interface LikeStore {
  add(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  count(): Promise<number>;
}

const SET_KEY = 'portfolio:likes';
const ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

/** In-memory store, used by the local dev server. Resets when the server restarts. */
export function createMemoryStore(): LikeStore {
  const ids = new Set<string>();
  return {
    async add(id) { ids.add(id); },
    async remove(id) { ids.delete(id); },
    async count() { return ids.size; },
  };
}

/** Upstash Redis over its REST API (what Vercel's Redis integration provisions). */
export function createUpstashStore(url: string, token: string): LikeStore {
  async function run(commands: Array<Array<string>>): Promise<unknown[]> {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!response.ok) throw new Error(`Redis request failed (${response.status})`);
    const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
    const failed = results.find(item => item.error);
    if (failed) throw new Error(failed.error);
    return results.map(item => item.result);
  }
  return {
    async add(id) { await run([['SADD', SET_KEY, id]]); },
    async remove(id) { await run([['SREM', SET_KEY, id]]); },
    async count() { return Number((await run([['SCARD', SET_KEY]]))[0]) || 0; },
  };
}

/** Picks the Redis store from environment variables, or null when none is configured. */
export function storeFromEnv(env: Record<string, string | undefined>): LikeStore | null {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return url && token ? createUpstashStore(url, token) : null;
}

export interface LikeResponse { status: number; body: { count?: number; error?: string } }

/** GET -> { count }.  POST { id, liked } -> { count }. */
export async function handleLikes(method: string, rawBody: unknown, store: LikeStore | null): Promise<LikeResponse> {
  if (!store) return { status: 503, body: { error: 'Likes are not configured on this server.' } };
  try {
    if (method === 'GET') return { status: 200, body: { count: await store.count() } };
    if (method !== 'POST') return { status: 405, body: { error: 'Method not allowed.' } };

    let body = rawBody;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
    const { id, liked } = (body ?? {}) as { id?: unknown; liked?: unknown };
    if (typeof id !== 'string' || !ID_PATTERN.test(id) || typeof liked !== 'boolean') {
      return { status: 400, body: { error: 'Expected { id, liked }.' } };
    }
    if (liked) await store.add(id); else await store.remove(id);
    return { status: 200, body: { count: await store.count() } };
  } catch {
    return { status: 502, body: { error: 'Like storage is unavailable right now.' } };
  }
}
