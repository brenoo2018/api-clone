import { Hono } from "hono";
import { logger } from 'hono/logger'
import { corsMiddleware } from "./infra/middlewares/cors-middleware";
import { onErrorMiddleware } from "./infra/middlewares/on-error-middleware";
import { auth } from "./infra/middlewares/auth-middleware";
import { cacheMiddleware } from "./infra/middlewares/cache-middleware";

import { helloRoutes } from "./infra/routes/hello";
import { citiesRoutes } from "./infra/routes/cities";
import { eventsRoutes } from "./infra/routes/events";
import { geolocationRoutes } from "./infra/routes/geolocation";
import { researchRoutes } from "./infra/routes/researches";
import { categoriesRoutes } from "./infra/routes/categories";
import { automationRoutes } from "./infra/routes/automations";


import { HonoEnv } from "./types/hono-env";

export const app = new Hono<HonoEnv>();

app.use(corsMiddleware);
app.use(logger())
app.onError(onErrorMiddleware);

app.route('/', automationRoutes);

app.route('/', geolocationRoutes);
app.get('*', cacheMiddleware);
app.route('/', helloRoutes);
app.route('/', citiesRoutes);

app.use(auth);
app.route('/', researchRoutes);
app.route('/', categoriesRoutes);
app.route('/', eventsRoutes);