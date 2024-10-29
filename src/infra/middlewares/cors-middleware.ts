import { createMiddleware } from 'hono/factory';

export const corsMiddleware = createMiddleware(async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  c.header(
    'Access-Control-Allow-Headers',
    c.req.header('Access-Control-Request-Headers') ??
    'accept, accept-language, authorization'
  );
  c.header('Access-Control-Max-Age', '7200');

  if (c.req.method === 'OPTIONS') {
    c.status(204);
    c.header('Content-Length', '0');
    return c.text('');
  }

  await next();
});
