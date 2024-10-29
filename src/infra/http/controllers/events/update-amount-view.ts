import { z } from 'zod';
import { RouteHandler } from '../../../../types/route-handler';
import { makeUpdateAmountViewUseCase } from '../../../../app/factories/make-update-amount-view-use-case';

export const updateAmountView: RouteHandler = async ({ json, env, req }) => {
  const updateAmountViewQuerySchema = z.object({
    id: z.string().trim(),
  });

  const { id } = updateAmountViewQuerySchema.parse(req.param());

  const useCase = makeUpdateAmountViewUseCase();

  await useCase.execute({
    env,
    id: Number(id),
  });

  return json({ message: 'Amount view updated successfully' }, 200);
};
