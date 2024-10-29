import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { SearchEventsNearbyUseCase } from '../use-cases/search-events-nearby';

export function makeSearchEventsNearbyUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new SearchEventsNearbyUseCase(prismaEventsRepository);

  return useCase;
}
