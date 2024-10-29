import { EventTheme, Prisma } from '@prisma/client';
import { Bindings } from '../../types/bindings';

export interface EventsThemesRepository {
  deleteByEventId(
    env: Bindings,
    params: { id: number }
  ): Promise<void>;
  create(
    env: Bindings,
    data: Prisma.EventThemeUncheckedCreateInput
  ): Promise<any>;
  update(env: Bindings, data: EventTheme): Promise<EventTheme>;
  searchByEventId(env: Bindings, event_id: number): Promise<{ id: number; }[]>
}
