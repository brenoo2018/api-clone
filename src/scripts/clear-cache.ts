import { Context } from "hono";

export async function clearCache(c: Context) {
  const body = await c.req.json();

  if (!body || !body.url) {
    return c.json({ message: `campo "url" obrigatório` }, 400);
  }

  const customCacheName = 'api';
  const cacheKey = new Request(body.url)
  const cache = await caches.open(customCacheName);
  await cache.delete(cacheKey);

  return new Response('Cache limpo com sucesso!', { status: 200 });
}