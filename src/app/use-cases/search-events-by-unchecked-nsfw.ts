import { Bindings } from "../../types/bindings";
import { EventsAiRepository } from "../../domain/repositories/events-ai-repository";
import { QueueRepository } from "../../domain/repositories/queue-repository";
import { delayInMs } from "../../utils/delay";
import { SearchEventsByUncheckedTagsUseCase } from "./search-events-by-unchecked-tags";

type SearchEventsByUncheckedNSFWUseCaseRequest = {
  env: Bindings;
  page: number;
  limit: number;
};


export class SearchEventsByUncheckedNSFWUseCase {
  constructor(
    private eventsAiRepository: EventsAiRepository,
    private queueRepository: QueueRepository,
  ) { }

  async execute({
    env,
    page,
    limit,

  }: SearchEventsByUncheckedNSFWUseCaseRequest) {
    // const limitPage = 5;

    const eventsByUncheckedNSFW = await this.eventsAiRepository.searchByUncheckedNSFW({
      env,
      is_checked_nsfw: false,
      page,
      limit,
    });

    console.log(`eventos a serem verificados nsfw encontrados ${eventsByUncheckedNSFW.length} na página ${page}`)


    if (eventsByUncheckedNSFW.length === 0) {
      // const searchEventsByUncheckedTagsWUseCase = new SearchEventsByUncheckedTagsUseCase(this.eventsAiRepository, this.queueRepository);
      // await searchEventsByUncheckedTagsWUseCase.execute({ env, page, limit: 10 });
      return { message: `Finished send to AI verify nsfw, arrived in last page`, status: 200 }
    }
    //manda para a fila de processamento;
    await this.queueRepository.send(env, { events: eventsByUncheckedNSFW, action: 'unchecked_ai_nsfw_detail_job' });

    await delayInMs(env.DELAY_MILLISECONDS);


    // Se ainda houver eventos, chama a próxima página
    // if (page !== limitPage) {
    await this.queueRepository.send(env, { page: page + 1, action: 'unchecked_ai_nsfw_fetch_page_job' });
    // }

    //chama a próxima página
    return { message: `Send to AI verify nsfw`, status: 200 }
  }
}