import { SearchEventsByUncheckedAIUseCase } from "../../../../app/use-cases/search-events-by-unchecked-christian";
import { HttpQueueRepository } from "../../../../infra/repositories/http/request-queue-repository";
import { PrismaEventsAiRepository } from "../../../../infra/repositories/database/prisma/prisma-events-ai-repository";
import { Bindings } from "../../../../types/bindings";

export async function uncheckedAiChristianFetchPageJob({ env, page }: {
  env: Bindings
  page: number
}) {
  const httpQueue = new HttpQueueRepository();
  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const searchEventsByUnchecked = new SearchEventsByUncheckedAIUseCase(prismaEventsAiRepository, httpQueue);

  await searchEventsByUnchecked.execute({ env, page, limit: 10 });
}