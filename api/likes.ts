// Vercel serverless function: GET /api/likes and POST /api/likes
// Needs a Redis database connected to the project (see README, "Shared like counter").
import { handleLikes, storeFromEnv } from '../server/likes';

interface Req { method?: string; body?: unknown }
interface Res {
  status(code: number): Res;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

export default async function handler(req: Req, res: Res) {
  const method = req.method ?? 'GET';
  const result = await handleLikes(method, req.body, storeFromEnv(process.env));
  // Reads can be cached for a few seconds to save Redis calls; writes never are.
  res.setHeader('Cache-Control', method === 'GET' && result.status === 200 ? 'public, s-maxage=10, stale-while-revalidate=60' : 'no-store');
  res.status(result.status).json(result.body);
}
