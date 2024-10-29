import { EventsRepository } from "../../domain/repositories/events-repository";
import { Bindings } from "../../types/bindings";
import { convertUnixEpochToDateBrazilian } from "../../utils/dates";

type SearchEventsNearbyUseCaseRequest = {
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
};
type SearchEventsNearbyUseCaseResponse = {
  events: Array<any>;
  total: number;
  pages: number;
  title?: string;
  endpoint?: string;

};

export class SearchEventsNearbyUseCase {
  constructor(private eventsRepository: EventsRepository) { }

  private getSectionParams(section: string | undefined) {
    if (!section) return {};

    switch (section) {
      case 'nearby':
        return {
          distance: 50, // distância em quilômetros
          title: 'Perto de você',
          endpoint: 'nearby'
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
  }: SearchEventsNearbyUseCaseRequest): Promise<SearchEventsNearbyUseCaseResponse> {

    console.log('🚀 use-case search nearby events', {
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

    });

    const {
      distance,
      title,
      endpoint,
    } = this.getSectionParams(section);

    let events: any[] = [];
    let count = 0;

    if (latitude && longitude && distance) {
      ({ events, count } = await this.eventsRepository.searchManyNearby(env, {
        query,
        modality_id,
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
        distance,
        ordenation,
      }));
    }

    if (events.length === 0 && city) {
      ({ events, count } = await this.eventsRepository.searchManyNearby(env, {
        query,
        city,
        modality_id,
        category_id,
        theme_id,
        is_free,
        start_at,
        end_at,
        page,
        limit,
        is_active,
        provider,
        ordenation,
      }));
    }
    if (events.length === 0 && state) {
      ({ events, count } = await this.eventsRepository.searchManyNearby(env, {
        query,
        state,
        modality_id,
        category_id,
        theme_id,
        is_free,
        start_at,
        end_at,
        page,
        limit,
        is_active,
        provider,
        ordenation,
      }));
    }

    const pages = Math.ceil(count / limit); // Arredonda para cima


    return { events, total: count, pages, endpoint, title };


  }
}