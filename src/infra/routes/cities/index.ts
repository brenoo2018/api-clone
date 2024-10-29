import { Hono } from 'hono';
import { HonoEnv } from '../../../types/hono-env';
import { search } from '../../http/controllers/cities/search';

export const citiesRoutes = new Hono<HonoEnv>();

citiesRoutes.get('/cities', search);
