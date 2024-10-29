import { z } from 'zod';
import { makeCountEventsByCategoryUseCase } from '../../../../app/factories/make-count-events-by-category-use-case';
import { RouteHandler } from '../../../../types/route-handler';
import { isEmptyString } from '../../../../utils/isEmptyString';

export const countEventsByCategory: RouteHandler = async ({
  json,
  env,
  req,
}) => {

  const searchEventsByCategoryQuerySchema = z.object({
    provider: z.preprocess(isEmptyString, z.string().trim().optional()),
    is_active: z.string().optional(),
  });

  const { is_active, provider } = searchEventsByCategoryQuerySchema.parse(req.query());

  const useCase = makeCountEventsByCategoryUseCase();

  const is_active_boolean = is_active === 'true' ? true : is_active === 'false' ? false : undefined;

  const { count_by_category } = await useCase.execute({
    env,
    is_active: is_active_boolean,
    provider
  });

  return json({ count_by_category }, 200);
};
