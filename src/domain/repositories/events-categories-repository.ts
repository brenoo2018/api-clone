import { EventCategory, Prisma } from '@prisma/client';
import { Bindings } from '../../types/bindings';

export interface EventsCategoriesRepository {
  deleteByEventId(
    env: Bindings,
    params: { id: number }
  ): Promise<void>;
  create(
    env: Bindings,
    data: Prisma.EventCategoryUncheckedCreateInput
  ): Promise<any>;
  update(env: Bindings, data: EventCategory): Promise<EventCategory>;
  searchByEventId(env: Bindings, event_id: number): Promise<{ id: number; }[]>
}
