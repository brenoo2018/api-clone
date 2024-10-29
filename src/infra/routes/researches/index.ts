import { Hono } from 'hono';
import { HonoEnv } from '../../../types/hono-env';
import { create } from '../../http/controllers/researches/create';

export const researchRoutes = new Hono<HonoEnv>();

researchRoutes.post('/research', create);
