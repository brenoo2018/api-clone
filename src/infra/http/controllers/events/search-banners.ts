import { z } from 'zod';
import { RouteHandler } from '../../../../types/route-handler';
import { makeSearchBannersUseCase } from '../../../../app/factories/make-search-banners';

export const searchBanners: RouteHandler = async ({ json, env, req }) => {
  // const searchBannersQuerySchema = z.object({
  //   ids: z.string().trim(),
  // });

  // const { ids } = searchBannersQuerySchema.parse(req.query());

  // const idsArray = ids.split(',')
  //   .map((id) => Number(id.trim()))  // Converte para número
  //   .filter((id) => !isNaN(id));     // Remove valores inválidos (NaN)

  const useCase = makeSearchBannersUseCase();

  const { banners } = await useCase.execute({
    env,
    // ids: idsArray
  });

  return json(banners, 200);
};
