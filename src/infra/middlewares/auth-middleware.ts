import { jwtVerify } from 'jose';
import { createMiddleware } from 'hono/factory';

export const auth = createMiddleware(async (ctx, next) => {
  try {
    const authorizationHeader = ctx.req.header('Authorization');
    const apiKeyHeader = ctx.req.header('avivah-api-key');

    if (!authorizationHeader && !apiKeyHeader) {
      return ctx.json({ error: 'Authorization header or API key not provided' }, 400);
    }

    // Verificação do Bearer Token
    if (authorizationHeader) {
      const [scheme, jwtToken] = authorizationHeader.split(' ');

      if (scheme !== 'Bearer') {
        return ctx.json({ error: 'Invalid authorization scheme' }, 400);
      }

      if (!jwtToken) return ctx.json({ error: 'JWT not provided' }, 400);

      await jwtVerify(jwtToken, ctx.env.JWT_SECRET);

      await next();
      return;

      // const { payload } = await jwtVerify<{ session_id: string }>(jwtToken, secret);

      // console.log('aaa', payload);
      // const userId = payload.session_id;

      // ctx.set('userId', userId);
    }

    // Verificação do API Key
    if (apiKeyHeader) {
      if (!ctx.env.API_KEYS.includes(apiKeyHeader)) {
        return ctx.json({ error: 'Invalid API key' }, 401);
      }
      await next();
      return;
    }

    // Se nenhum dos métodos de autenticação for válido
    return ctx.json({ error: 'Unauthorized' }, 401);

  } catch (error: any) {
    console.error(error);
    return ctx.json(
      { error: error.message ? error.message : 'Something went wrong' },
      401
    );
  }
});
