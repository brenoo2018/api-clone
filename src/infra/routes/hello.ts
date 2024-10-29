import { Hono } from "hono";
import { HonoEnv } from "../../types/hono-env";

export const helloRoutes = new Hono<HonoEnv>();

helloRoutes.get('/', (c) => {
  return c.json({ message: 'Hello Avivah!' });
});