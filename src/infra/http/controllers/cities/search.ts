import { makeSearchCitiesUseCase } from '../../../../app/factories/make-search-cities-use-case';
import { RouteHandler } from '../../../../types/route-handler';

export const search: RouteHandler = ({ json, env, req }) => {
  const searchUseCase = makeSearchCitiesUseCase();

  const { states_and_cities } = searchUseCase.execute();

  return json({ states_and_cities }, 200);
};
