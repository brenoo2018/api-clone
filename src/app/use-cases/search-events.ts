import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';
import { getStartAndEndOfDay } from '../../utils/dates';

type SearchEventsUseCaseRequest = {
  env: Bindings;
  query?: string;
  state?: string;
  city?: string;
  modality_id?: number;
  ordenation?: 'amount_view' | 'start_at' | 'title';
  category_id?: number;
  theme_id?: number;
  is_free?: boolean;
  start_at?: number;
  end_at?: number;
  provider?: string;
  is_active?: boolean;
  section?: 'trending' | 'most-accessed' | 'starting-in-few-days' | 'new-events' | 'nearby';
  latitude?: number;
  longitude?: number;
  page: number;
  limit: number;
  reason?: 'event_finished' | 'event_deleted' | 'event_non_christian' | 'event_non_nsfw' | 'event_non_tags';
  id?: number;
  external_id?: number;
  ids?: number[];
};
type SearchEventsUseCaseResponse = {
  events: Array<any>;
  total: number;
  pages: number;
  title?: string;
  endpoint?: string;
};

export class SearchEventsUseCase {
  constructor(private eventsRepository: EventsRepository) { }

  // Função auxiliar para calcular parâmetros baseados na seção
  private getSectionParams(section: string | undefined) {
    if (!section) return {};

    switch (section) {
      case 'trending':
        return {
          thirtyDaysAgo: getStartAndEndOfDay('past', 30).end,
          ordenationSection: 'amount_inscription' as 'amount_inscription',
          providerEi: 'einscricao',
          title: 'Em alta',
          endpoint: 'trending'
        };
      case 'most-accessed':
        return {
          thirtyDaysAgo: getStartAndEndOfDay('past', 30).end,
          ordenationSection: 'amount_view' as 'amount_view',
          title: 'Mais acessados',
          endpoint: 'most-accessed'
        };
      case 'starting-in-few-days':
        return {
          today: getStartAndEndOfDay('today').start,
          thirtyDaysLater: getStartAndEndOfDay('future', 30).end,
          ordenationSection: 'start_at' as 'start_at',
          title: 'Nos próximos dias',
          endpoint: 'starting-in-few-days'
        };
      case 'new-events':
        return {
          today: getStartAndEndOfDay('today').start,
          fourteenDaysAgo: getStartAndEndOfDay('past', 14).end,
          ordenationSection: 'created_at' as 'created_at',
          title: 'Novos eventos',
          endpoint: 'new-events'
        };
      default:
        return {};
    }
  }

  async execute({
    env,
    query,
    state,
    city,
    modality_id,
    ordenation,
    category_id,
    theme_id,
    is_free,
    start_at,
    end_at,
    page,
    limit,
    is_active,
    provider,
    latitude,
    longitude,
    section,
    reason,
    id,
    external_id,
    ids
  }: SearchEventsUseCaseRequest): Promise<SearchEventsUseCaseResponse> {
    console.log('🚀 use-case search events', {
      query,
      state,
      city,
      modality_id,
      ordenation,
      category_id,
      theme_id,
      is_free,
      start_at,
      end_at,
      page,
      limit,
      is_active,
      provider,
      latitude,
      longitude,
      section,
      reason,
      id,
      external_id,
      ids
    });

    const {
      providerEi,
      ordenationSection,
      fourteenDaysAgo,
      thirtyDaysAgo,
      thirtyDaysLater,
      today,
      title,
      endpoint
    } = this.getSectionParams(section);

    // const finalOrdenation = (ordenation || ordenationSection) || 'title';


    const { events, count } = await this.eventsRepository.search(env, {
      query,
      state,
      city,
      modality_id,
      ordenation,
      ordenationSection,
      category_id,
      theme_id,
      is_free,
      start_at,
      end_at,
      page,
      limit,
      is_active,
      provider: providerEi || provider,
      fourteenDaysAgo,
      thirtyDaysAgo,
      thirtyDaysLater,
      today,
      section,
      latitude,
      longitude,
      reason,
      id,
      external_id,
      ids
    });

    const pages = Math.ceil(count / limit); // Arredonda para cima

    return { events: events, total: count, pages, endpoint, title };
  }
}
