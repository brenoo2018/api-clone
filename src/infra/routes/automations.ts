import { Hono } from "hono";
import { HonoEnv } from "../../types/hono-env";
import { searchEventsByUncheckedChristian } from "../http/controllers/events/search-events-by-unchecked-christian";
import { searchEventsByUncheckedNFSW } from "../http/controllers/events/search-events-by-unchecked-nfsw";
import { searchEventsByUncheckedTags } from "../http/controllers/events/search-events-by-unchecked-tags";
import { verifyEventExpire } from "../http/controllers/events/verify-events-expire";
import { syncDatabase } from "../../scripts/sync-database";
import { clearCache } from "../../scripts/clear-cache";

export const automationRoutes = new Hono<HonoEnv>();

automationRoutes.post('/clear-cache', clearCache);

automationRoutes.get('/sync-database', async (c) => {
  return await syncDatabase(c.env);
});

automationRoutes.get('/unchecked-christian', async (c) => {
  return await searchEventsByUncheckedChristian(c.env, 1);
});

automationRoutes.get('/unchecked-nsfw', async (c) => {
  return await searchEventsByUncheckedNFSW(c.env, 1);
});

automationRoutes.get('/unchecked-tags', async (c) => {
  return await searchEventsByUncheckedTags(c.env, 1);
});

automationRoutes.get('/verify-expire', async (c) => {
  return await verifyEventExpire(c.env);
});

