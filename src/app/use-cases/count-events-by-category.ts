import { Bindings } from '../../types/bindings';
import { CategoriesRepository } from '../../domain/repositories/categories-repository';
import { formatString } from '../../utils/format-string';

type CountEventsByCategoryUseCaseRequest = {
  env: Bindings;
  provider?: string;
  is_active?: boolean;
};

type CountEventsByCategoryUseCaseResponse = {
  count_by_category: {
    id: number;
    title: string;
    event_count: number;
  }[];
};

export class CountEventsByCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    env,
    provider,
    is_active,
  }: CountEventsByCategoryUseCaseRequest): Promise<CountEventsByCategoryUseCaseResponse> {
    console.log('propss CountEventsByCategoryUseCase-->', {
      provider,
      is_active,
    });
    const categoriesWithEventCount =
      await this.categoriesRepository.countByCategory(env, provider, is_active);

    return { count_by_category: categoriesWithEventCount };
  }
}
