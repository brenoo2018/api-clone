import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { UpdateAmountInscriptionUseCase } from '../use-cases/update-amount-inscription';

export function makeUpdateAmountInscriptionUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new UpdateAmountInscriptionUseCase(prismaEventsRepository);

  return useCase;
}
