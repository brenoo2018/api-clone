import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { UpdateAmountViewUseCase } from '../use-cases/update-amount-view';

export function makeUpdateAmountViewUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new UpdateAmountViewUseCase(prismaEventsRepository);

  return useCase;
}
