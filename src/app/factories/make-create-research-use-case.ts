import { PrismaResearchesRepository } from '../../infra/repositories/database/prisma/prisma-researches-repository';
import { CreateResearchUseCase } from '../use-cases/create-research';

export function makeCreateResearchUseCase() {
  const prismaResearchRepository = new PrismaResearchesRepository();

  const useCase = new CreateResearchUseCase(prismaResearchRepository);

  return useCase;
}
