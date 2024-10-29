import { Hono } from 'hono';
import { HonoEnv } from '../../../types/hono-env';
import { countEventsByCategory } from '../../http/controllers/categories/count-events-by-category';

export const categoriesRoutes = new Hono<HonoEnv>();

categoriesRoutes.get(
  '/category/count-events-by-category',
  countEventsByCategory
);
