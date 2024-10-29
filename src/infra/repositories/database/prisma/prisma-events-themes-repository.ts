import { Prisma, EventTheme } from '@prisma/client';
import { EventsThemesRepository } from '../../../../domain/repositories/events-themes-repository';
import { Bindings } from '../../../../types/bindings';
import { createPrismaClient } from '../../../../utils/create-prisma-client';

export class PrismaEventsThemesRepository implements EventsThemesRepository {
  async deleteByEventId(
    env: Bindings,
    { id }: { id: number }
  ) {
    const prisma = createPrismaClient(env);
    await prisma.eventTheme.delete({
      where: { id },
    });
  }
  async create(env: Bindings, data: Prisma.EventThemeUncheckedCreateInput) {
    const prisma = createPrismaClient(env);

    const eventTheme = await prisma.eventTheme.create({ data });
    return eventTheme;
  }
  async update(env: Bindings, data: EventTheme) {
    const prisma = createPrismaClient(env);

    const eventTheme = await prisma.eventTheme.update({
      where: { id: data.id },
      data,
    });

    return eventTheme;
  }
  async searchByEventId(env: Bindings, event_id: number) {
    const prisma = createPrismaClient(env);

    const eventModality = await prisma.eventTheme.findMany({
      select: { id: true },
      where: { event_id },
    });
    return eventModality;
  }
}
