import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { SearchEventsUseCase } from '../use-cases/search-events';

export function makeSearchEventsUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new SearchEventsUseCase(prismaEventsRepository);

  return useCase;
}
