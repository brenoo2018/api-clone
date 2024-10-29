import { SearchEventsByUncheckedTagsUseCase } from "../../../../app/use-cases/search-events-by-unchecked-tags";
import { Bindings } from "../../../../types/bindings";
import { PrismaEventsAiRepository } from "../../../repositories/database/prisma/prisma-events-ai-repository";
import { HttpQueueRepository } from "../../../repositories/http/request-queue-repository";

export async function searchEventsByUncheckedTags(env: Bindings, page: number) {
  const httpQueue = new HttpQueueRepository();
  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const searchEventsByUncheckedTagsWUseCase = new SearchEventsByUncheckedTagsUseCase(prismaEventsAiRepository, httpQueue);

  const { message, status } = await searchEventsByUncheckedTagsWUseCase.execute({ env, page, limit: 30 });

  return new Response(JSON.stringify({ message }), { status });

}