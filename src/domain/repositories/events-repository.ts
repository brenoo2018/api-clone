import { Event, Prisma } from '@prisma/client';
import { Bindings } from '../../types/bindings';
import { SearchEventByExternalId, SearchEventsRepository } from '../entities/events';

export type TPropsSearchEvents = {
  query?: string;
  state?: string;
  city?: string;
  modality_id?: number;
  ordenation?: 'amount_view' | 'start_at' | 'title';
  ordenationSection?: 'amount_view' | 'start_at' | 'amount_inscription' | 'created_at';
  category_id?: number;
  theme_id?: number;
  is_free?: boolean;
  start_at?: number;
  end_at?: number;
  provider?: string;
  is_active?: boolean;
  section?: 'trending' | 'most-accessed' | 'starting-in-few-days' | 'new-events' | 'nearby';
  thirtyDaysAgo?: number;
  thirtyDaysLater?: number;
  fourteenDaysAgo?: number;
  today?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
  page: number;
  limit: number;
  reason?: 'event_finished' | 'event_deleted' | 'event_non_christian' | 'event_non_nsfw' | 'event_non_tags';
  id?: number;
  external_id?: number;
  ids?: number[];
};

export type TPropsSearchManyNearbyParams = {
  provider?: string;
  is_active?: boolean;
  query?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  modality_id?: number;
  category_id?: number;
  theme_id?: number;
  is_free?: boolean;
  start_at?: number;
  end_at?: number;
  page: number;
  limit: number;
  ordenation?: 'amount_view' | 'start_at' | 'title';
};

export interface EventsRepository {
  createEvent(
    env: Bindings,
    data: Prisma.EventUncheckedCreateInput
  ): Promise<Event>;
  updateEvent(env: Bindings, id: number, data: Prisma.EventUncheckedUpdateInput): Promise<Event>;
  updateAmountView(
    env: Bindings,
    params: { id: number; updated_at: number }
  ): Promise<void>;
  updateAmountInscription(
    env: Bindings,
    params: { id: number; amount_inscription: number; updated_at: number }
  ): Promise<void>;
  deleteEvent(
    env: Bindings,
    params: { id: number; deleted_at?: number; is_active: boolean; reason: string, is_pending?: boolean }
  ): Promise<void>;
  searchManyNearby(
    env: Bindings,
    params: TPropsSearchManyNearbyParams
  ): Promise<{ events: SearchEventsRepository[]; count: number }>;
  search(
    env: Bindings,
    params: TPropsSearchEvents
  ): Promise<{ events: SearchEventsRepository[]; count: number }>;
  searchByExternalId(
    env: Bindings,
    params: { external_id: number; provider: string }
  ): Promise<SearchEventByExternalId | null>;
  searchByExpire(env: Bindings, todayDate: number): Promise<Event[]>;
  searchBanners(env: Bindings, ids: number[]): Promise<{ events: Array<any>; }>;

  totalCount(env: Bindings, provider?: string, is_active?: boolean): Promise<number>;
}
