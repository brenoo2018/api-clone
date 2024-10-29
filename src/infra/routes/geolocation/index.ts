import { Hono } from 'hono';
import { HonoEnv } from '../../../types/hono-env';
import { search } from '../../http/controllers/geolocation/search';

export const geolocationRoutes = new Hono<HonoEnv>();

geolocationRoutes.get('/geolocation', search);
