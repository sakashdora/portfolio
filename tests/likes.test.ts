import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryStore, createUpstashStore, handleLikes, storeFromEnv } from '../server/likes.ts';

const alice = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const bob = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

test('counts start at zero and one visitor counts once however often they like', async () => {
  const store = createMemoryStore();
  assert.deepEqual((await handleLikes('GET', null, store)).body, { count: 0 });
  await handleLikes('POST', { id: alice, liked: true }, store);
  const repeat = await handleLikes('POST', { id: alice, liked: true }, store);
  assert.equal(repeat.body.count, 1);
});

test('different visitors add up and un-liking removes only that visitor', async () => {
  const store = createMemoryStore();
  await handleLikes('POST', { id: alice, liked: true }, store);
  const two = await handleLikes('POST', { id: bob, liked: true }, store);
  assert.equal(two.body.count, 2);
  const one = await handleLikes('POST', { id: alice, liked: false }, store);
  assert.equal(one.body.count, 1);
  const unknown = await handleLikes('POST', { id: alice, liked: false }, store);
  assert.equal(unknown.body.count, 1);
});

test('accepts a JSON string body (some runtimes do not pre-parse)', async () => {
  const store = createMemoryStore();
  const result = await handleLikes('POST', JSON.stringify({ id: alice, liked: true }), store);
  assert.equal(result.status, 200);
  assert.equal(result.body.count, 1);
});

test('rejects malformed requests and unsupported methods', async () => {
  const store = createMemoryStore();
  assert.equal((await handleLikes('POST', { id: 'short', liked: true }, store)).status, 400);
  assert.equal((await handleLikes('POST', { id: alice, liked: 'yes' }, store)).status, 400);
  assert.equal((await handleLikes('POST', '{not json', store)).status, 400);
  assert.equal((await handleLikes('POST', null, store)).status, 400);
  assert.equal((await handleLikes('DELETE', null, store)).status, 405);
});

test('reports unavailable storage instead of inventing a number', async () => {
  assert.equal((await handleLikes('GET', null, null)).status, 503);
  const broken = { add: async () => { throw new Error('down'); }, remove: async () => {}, count: async () => { throw new Error('down'); } };
  assert.equal((await handleLikes('GET', null, broken)).status, 502);
});

test('the Redis store talks to the Upstash REST pipeline and reads the set size', async () => {
  const calls: Array<{ url: string; body: unknown; auth: string | null }> = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)), auth: new Headers(init.headers).get('Authorization') });
    return new Response(JSON.stringify([{ result: 7 }]), { status: 200 });
  }) as typeof fetch;
  try {
    const store = createUpstashStore('https://example.upstash.io/', 'secret');
    assert.equal(await store.count(), 7);
    await store.add(alice);
    assert.equal(calls[0].url, 'https://example.upstash.io/pipeline');
    assert.deepEqual(calls[0].body, [['SCARD', 'portfolio:likes']]);
    assert.deepEqual(calls[1].body, [['SADD', 'portfolio:likes', alice]]);
    assert.equal(calls[0].auth, 'Bearer secret');
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('picks Redis credentials from either Upstash or Vercel KV variable names', () => {
  assert.equal(storeFromEnv({}), null);
  assert.ok(storeFromEnv({ UPSTASH_REDIS_REST_URL: 'https://x', UPSTASH_REDIS_REST_TOKEN: 't' }));
  assert.ok(storeFromEnv({ KV_REST_API_URL: 'https://x', KV_REST_API_TOKEN: 't' }));
  assert.equal(storeFromEnv({ KV_REST_API_URL: 'https://x' }), null);
});
