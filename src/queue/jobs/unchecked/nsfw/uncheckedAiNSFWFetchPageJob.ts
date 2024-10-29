import { SearchEventsByUncheckedNSFWUseCase } from "../../../../app/use-cases/search-events-by-unchecked-nsfw";
import { HttpQueueRepository } from "../../../../infra/repositories/http/request-queue-repository";
import { PrismaEventsAiRepository } from "../../../../infra/repositories/database/prisma/prisma-events-ai-repository";
import { Bindings } from "../../../../types/bindings";

export async function uncheckedAiNSFWFetchPageJob({ env, page }: {
  env: Bindings
  page: number
}) {
  const httpQueue = new HttpQueueRepository();
  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const searchEventsByUnchecked = new SearchEventsByUncheckedNSFWUseCase(prismaEventsAiRepository, httpQueue);

  await searchEventsByUnchecked.execute({ env, page, limit: 10 });
}