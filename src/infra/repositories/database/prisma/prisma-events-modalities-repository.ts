import { Prisma, EventModality, PrismaClient } from '@prisma/client';
import { EventsModalitiesRepository } from '../../../../domain/repositories/events-modalities-repository';
import { Bindings } from '../../../../types/bindings';
import { createPrismaClient } from '../../../../utils/create-prisma-client';

export class PrismaEventsModalitiesRepository
  implements EventsModalitiesRepository {
  async deleteByEventId(
    env: Bindings,
    { id }: { id: number }
  ) {
    const prisma = createPrismaClient(env);
    await prisma.eventModality.delete({
      where: { id },
    });
  }
  async create(env: Bindings, data: Prisma.EventModalityUncheckedCreateInput) {
    const prisma = createPrismaClient(env);

    await prisma.eventModality.create({ data });
  }
  async update(env: Bindings, data: EventModality) {
    const prisma = createPrismaClient(env);

    const eventModality = await prisma.eventModality.update({
      where: { id: data.id },
      data,
    });
    return eventModality;
  }
  async searchByEventId(env: Bindings, event_id: number) {
    const prisma = createPrismaClient(env);

    const eventModality = await prisma.eventModality.findMany({
      select: { id: true },
      where: { event_id },
    });
    return eventModality;
  }
}
