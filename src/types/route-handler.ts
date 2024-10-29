import { Handler } from 'hono';
import { HonoEnv } from './hono-env';

export type RouteHandler = Handler<HonoEnv>;
