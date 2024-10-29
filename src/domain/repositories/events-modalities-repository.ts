import { EventModality, Prisma } from '@prisma/client';
import { Bindings } from '../../types/bindings';

export interface EventsModalitiesRepository {
  deleteByEventId(
    env: Bindings,
    params: { id: number }
  ): Promise<void>;
  create(
    env: Bindings,
    data: Prisma.EventModalityUncheckedCreateInput
  ): Promise<void>;
  update(env: Bindings, data: EventModality): Promise<EventModality>;
  searchByEventId(env: Bindings, event_id: number): Promise<{ id: number; }[]>
}
