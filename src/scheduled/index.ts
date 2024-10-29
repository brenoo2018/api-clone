import { searchEventsByUncheckedChristian } from "../infra/http/controllers/events/search-events-by-unchecked-christian";
import { searchEventsByUncheckedNFSW } from "../infra/http/controllers/events/search-events-by-unchecked-nfsw";
import { searchEventsByUncheckedTags } from "../infra/http/controllers/events/search-events-by-unchecked-tags";
import { verifyEventExpire } from "../infra/http/controllers/events/verify-events-expire";
import { Bindings } from "../types/bindings";

export async function scheduled(event: ScheduledEvent,
  env: Bindings,
  ctx: ExecutionContext) {

  if (env.ENVIRONMENT !== 'prd') {
    return new Response('Not allowed', {
      status: 403
    });
  }

  const cronTime = event.cron;

  // ["0 23 * * *", "0 3 * * *", "30 4 * * *", "0 6 * * *"] } # 3h da manhã, 4:30h da manhã, 6h da manhã
  switch (cronTime) {
    // case "0 23 * * *":
    //   ctx.waitUntil(verifyEventExpire(env));
    //   break;
    case "0 3 * * *":
      ctx.waitUntil(searchEventsByUncheckedChristian(env, 1));
      break;
    case "30 4 * * *":
      ctx.waitUntil(searchEventsByUncheckedNFSW(env, 1));
      break;
    case "0 6 * * *":
      ctx.waitUntil(searchEventsByUncheckedTags(env, 1));
      break;
  }

  console.log("cron processed");
}
