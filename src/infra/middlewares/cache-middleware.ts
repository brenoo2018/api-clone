import { cache } from "hono/cache"
import { getSecondsUntilMidnight } from "../../utils/dates"

export const cacheMiddleware = cache({
  cacheName: 'api',
  cacheControl: `max-age=${getSecondsUntilMidnight()}`,
});