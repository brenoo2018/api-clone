import { PrismaCategoriesRepository } from '../../infra/repositories/database/prisma/prisma-categories-repository';
import { CountEventsByCategoryUseCase } from '../use-cases/count-events-by-category';

export function makeCountEventsByCategoryUseCase() {
  const prismaCategoriesRepository = new PrismaCategoriesRepository();

  const useCase = new CountEventsByCategoryUseCase(prismaCategoriesRepository);

  return useCase;
}
