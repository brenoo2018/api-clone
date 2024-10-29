import { Prisma, EventCategory } from '@prisma/client';
import { EventsCategoriesRepository } from '../../../../domain/repositories/events-categories-repository';
import { Bindings } from '../../../../types/bindings';
import { createPrismaClient } from '../../../../utils/create-prisma-client';

export class PrismaEventsCategoriesRepository
  implements EventsCategoriesRepository {
  async deleteByEventId(
    env: Bindings,
    { id }: { id: number }
  ) {
    const prisma = createPrismaClient(env);
    await prisma.eventCategory.delete({
      where: { id }
    });
  }
  async create(env: Bindings, data: Prisma.EventCategoryUncheckedCreateInput) {
    const prisma = createPrismaClient(env);

    const eventCategory = await prisma.eventCategory.create({ data });
    return eventCategory;
  }
  async update(env: Bindings, data: EventCategory) {
    const prisma = createPrismaClient(env);

    const eventCategory = await prisma.eventCategory.update({
      where: { id: data.id },
      data,
    });

    return eventCategory;
  }
  async searchByEventId(env: Bindings, event_id: number) {
    const prisma = createPrismaClient(env);

    const eventCategory = await prisma.eventCategory.findMany({
      select: { id: true },
      where: { event_id },
    });
    return eventCategory;
  }
}
