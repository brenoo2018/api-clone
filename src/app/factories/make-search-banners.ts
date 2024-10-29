import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { SearchBannersUseCase } from '../use-cases/search-banners';

export function makeSearchBannersUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new SearchBannersUseCase(prismaEventsRepository);

  return useCase;
}
