import { PrismaEventsRepository } from '../../infra/repositories/database/prisma/prisma-events-repository';
import { DeleteEventUseCase } from '../use-cases/delete-event';

export function makeDeleteEventUseCase() {
  const prismaEventsRepository = new PrismaEventsRepository();
  const useCase = new DeleteEventUseCase(prismaEventsRepository);

  return useCase;
}
