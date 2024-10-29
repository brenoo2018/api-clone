import { RouteHandler } from '../../../../types/route-handler';
import { SearchGeolocationUseCase } from '../../../../app/use-cases/search-geolocation';

export const search: RouteHandler = async ({ json, env, req }) => {
  const useCase = new SearchGeolocationUseCase();

  const { geolocation } = await useCase.execute({ cf: req.raw.cf! });

  return json({ geolocation }, 200);
};
