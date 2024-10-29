import { HttpCitiesRepository } from '../../infra/repositories/http/http-cities-repository';
import { SearchCitiesUseCase } from '../use-cases/search-cities';

export function makeSearchCitiesUseCase() {
  const httpCitiesRepository = new HttpCitiesRepository();
  const useCase = new SearchCitiesUseCase(httpCitiesRepository);

  return useCase;
}
