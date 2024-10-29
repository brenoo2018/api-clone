import { z } from 'zod';
import { makeTotalEventsUseCase } from '../../../../app/factories/make-total-events-use-case';
import { RouteHandler } from '../../../../types/route-handler';
import { isEmptyString } from '../../../../utils/isEmptyString';

export const total: RouteHandler = async ({ json, env, req }) => {

  const searchTotalEventsQuerySchema = z.object({
    provider: z.preprocess(isEmptyString, z.string().trim().optional()),
    is_active: z.string().optional(),
  });

  const { is_active, provider } = searchTotalEventsQuerySchema.parse(req.query());

  const totalEventsUseCase = makeTotalEventsUseCase();

  const is_active_boolean = is_active === 'true' ? true : is_active === 'false' ? false : undefined;

  const totalEvents = await totalEventsUseCase.execute({
    env,
    is_active: is_active_boolean,
    provider
  });

  return json(totalEvents, 200);
};
