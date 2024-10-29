import { isAfter, parse } from "date-fns";
import { EventsRepository } from "../../domain/repositories/events-repository";
import { Bindings } from "../../types/bindings";

type SearchBannersUseCaseRequest = {
  env: Bindings;
  // ids: number[];
}
type SearchBannersUseCaseResponse = {
  banners: Array<any>;
}

export class SearchBannersUseCase {
  constructor(private eventsRepository: EventsRepository) { }

  async execute({
    env,
    // ids 
  }: SearchBannersUseCaseRequest): Promise<SearchBannersUseCaseResponse> {

    // if (!ids || ids.length === 0) {
    //   return { banners: [] }
    // }

    const selectEvents = [
      { id: 9119, until: '19/06/2025' },
      { id: 10338, until: '01/05/2025' },
      { id: 11437, until: '01/11/2024' },
      { id: 8824, until: '15/11/2024' },
      { id: 9064, until: '14/11/2024' }
    ];

    const ids = selectEvents.map(item => item.id);

    const { events } = await this.eventsRepository.searchBanners(env, ids);

    // Data atual
    const currentDate = new Date();

    // Filtrando eventos com base na data 'until'
    const filteredEvents = events.filter(event => {
      // Encontra o item correspondente no selectEvents
      const selectEvent = selectEvents.find(item => item.id === event.id);
      if (!selectEvent) return false; // Se não encontrar o evento correspondente, retorna false

      // Converte a data 'until' para um objeto Date
      const untilDate = parse(selectEvent.until, 'dd/MM/yyyy', new Date());

      // Retorna true se a data atual for anterior ou igual à data 'until'
      return !isAfter(currentDate, untilDate);
    });

    // Ordenando os eventos filtrados na ordem de selectEvents
    const orderedEvents = selectEvents
      .filter((selectEvent) => filteredEvents.some((event) => event.id === selectEvent.id))
      .map((selectEvent) => filteredEvents.find((event) => event.id === selectEvent.id));

    return { banners: orderedEvents };
  }
}