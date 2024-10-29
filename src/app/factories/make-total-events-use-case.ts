import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { TotalEventsUseCase } from '../use-cases/total-events';

export function makeTotalEventsUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new TotalEventsUseCase(prismaEventsRepository);

  return useCase;
}
