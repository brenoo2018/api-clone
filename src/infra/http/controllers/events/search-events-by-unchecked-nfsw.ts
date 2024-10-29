import { SearchEventsByUncheckedNSFWUseCase } from "../../../../app/use-cases/search-events-by-unchecked-nsfw";
import { Bindings } from "../../../../types/bindings";
import { PrismaEventsAiRepository } from "../../../repositories/database/prisma/prisma-events-ai-repository";
import { HttpQueueRepository } from "../../../repositories/http/request-queue-repository";

export async function searchEventsByUncheckedNFSW(env: Bindings, page: number) {
  const httpQueue = new HttpQueueRepository();
  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const searchEventsByUncheckedNSFWUseCase = new SearchEventsByUncheckedNSFWUseCase(prismaEventsAiRepository, httpQueue);

  const { message, status } = await searchEventsByUncheckedNSFWUseCase.execute({ env, page, limit: 30 });

  return new Response(JSON.stringify({ message }), { status });

}