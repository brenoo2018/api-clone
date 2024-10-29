import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { PrismaEventsCategoriesRepository } from '../../infra/repositories/database/prisma/prisma-events-categories-repository';
import { PrismaEventsModalitiesRepository } from '../../infra/repositories/database/prisma/prisma-events-modalities-repository';
import { PrismaEventsThemesRepository } from '../../infra/repositories/database/prisma/prisma-events-themes-repository';
import { CreateEventUseCase } from '../use-cases/create-event';

export function makeCreateEventUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const prismaEventsCategoriesRepository =
    new PrismaEventsCategoriesRepository();
  const prismaEventsModalitiesRepository =
    new PrismaEventsModalitiesRepository();
  const prismaEventsThemesRepository = new PrismaEventsThemesRepository();

  const useCase = new CreateEventUseCase(
    prismaEventsRepository,
    prismaEventsCategoriesRepository,
    prismaEventsModalitiesRepository,
    prismaEventsThemesRepository
  );

  return useCase;
}
