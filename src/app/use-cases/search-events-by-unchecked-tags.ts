import { Bindings } from "../../types/bindings";
import { EventsAiRepository } from "../../domain/repositories/events-ai-repository";
import { QueueRepository } from "../../domain/repositories/queue-repository";
import { delayInMs } from "../../utils/delay";

type SearchEventsByUncheckedTagsUseCaseRequest = {
  env: Bindings;
  page: number;
  limit: number;
};


export class SearchEventsByUncheckedTagsUseCase {
  constructor(
    private eventsAiRepository: EventsAiRepository,
    private queueRepository: QueueRepository,
  ) { }

  async execute({
    env,
    page,
    limit,

  }: SearchEventsByUncheckedTagsUseCaseRequest) {
    // const limitPage = 5;

    const eventsByUncheckedTags = await this.eventsAiRepository.searchByUncheckedTags({
      env,
      is_checked_tags: false,
      page,
      limit,
    });

    console.log(`eventos a serem verificados tags encontrados ${eventsByUncheckedTags.length} na página ${page}`)


    if (eventsByUncheckedTags.length === 0) {
      return { message: `Finished send to AI verify tags and categories, arrived in last page`, status: 200 }
    }
    //manda para a fila de processamento;
    await this.queueRepository.send(env, { events: eventsByUncheckedTags, action: 'unchecked_ai_tags_detail_job' });

    await delayInMs(env.DELAY_MILLISECONDS);

    // Se ainda houver eventos, chama a próxima página
    // if (page !== limitPage) {
    await this.queueRepository.send(env, { page: page + 1, action: 'unchecked_ai_tags_fetch_page_job' });
    // }

    //chama a próxima página
    return { message: `Send to AI verify tags`, status: 200 }
  }
}