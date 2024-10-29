import { SearchEventsByUncheckedAIUseCase } from "../../../../app/use-cases/search-events-by-unchecked-christian";
import { Bindings } from "../../../../types/bindings";
import { PrismaEventsAiRepository } from "../../../repositories/database/prisma/prisma-events-ai-repository";
import { HttpQueueRepository } from "../../../repositories/http/request-queue-repository";

export async function searchEventsByUncheckedChristian(env: Bindings, page: number) {
  const httpQueue = new HttpQueueRepository();
  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const searchEventsByUnchecked = new SearchEventsByUncheckedAIUseCase(prismaEventsAiRepository, httpQueue);

  const { message, status } = await searchEventsByUnchecked.execute({ env, page, limit: 30 });

  return new Response(JSON.stringify({ message }), { status });

}