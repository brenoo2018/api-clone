import { Event } from "@prisma/client";
import { Bindings } from "../../types/bindings";
import { EventsAiRepository } from "../../domain/repositories/events-ai-repository";
import { QueueRepository } from "../../domain/repositories/queue-repository";
import { delayInMs } from "../../utils/delay";
import { SearchEventsByUncheckedNSFWUseCase } from "./search-events-by-unchecked-nsfw";

type SearchEventsByUncheckedChristianUseCaseRequest = {
  env: Bindings;
  page: number;
  limit: number;
};


export class SearchEventsByUncheckedAIUseCase {
  constructor(
    private eventsAiRepository: EventsAiRepository,
    private queueRepository: QueueRepository,
  ) { }

  async execute({
    env,
    page,
    limit,

  }: SearchEventsByUncheckedChristianUseCaseRequest) {
    // const limitPage = 10;

    const eventsByUncheckedChristian = await this.eventsAiRepository.searchByUncheckedChristian({
      env,
      is_checked_christian: false,
      page,
      limit,
    });

    console.log(`eventos a serem verificados cristãos encontrados ${eventsByUncheckedChristian.length} na página ${page}`)


    if (eventsByUncheckedChristian.length === 0) {

      // const searchEventsByUncheckedNSFWUseCase = new SearchEventsByUncheckedNSFWUseCase(this.eventsAiRepository, this.queueRepository);
      // await searchEventsByUncheckedNSFWUseCase.execute({ env, page, limit: 10 });
      return { message: `Finished send to AI verify christian, arrived in last page`, status: 200 }
    }
    //manda para a fila de processamento;
    await this.queueRepository.send(env, { events: eventsByUncheckedChristian, action: 'unchecked_ai_christian_detail_job' });

    await delayInMs(env.DELAY_MILLISECONDS);

    // Se ainda houver eventos, chama a próxima página
    // if (page !== limitPage) {
    await this.queueRepository.send(env, { page: page + 1, action: 'unchecked_ai_christian_fetch_page_job' });
    // }

    //chama a próxima página
    return { message: `Send to AI verify christian`, status: 200 }
  }
}