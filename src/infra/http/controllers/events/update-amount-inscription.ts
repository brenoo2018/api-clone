import { z } from 'zod';
import { RouteHandler } from '../../../../types/route-handler';
import { makeUpdateAmountInscriptionUseCase } from '../../../../app/factories/make-update-amount-inscription-use-case';

export const updateAmountInscription: RouteHandler = async ({ json, env, req }) => {

  const body = await req.json();

  if (!body) {
    throw new Error('Body is required');
  }

  const updateAmountInscriptionQuerySchema = z.object({
    provider: z.string().trim(),
    external_id: z.string().trim(),
  });

  const updateAmountInscriptionBodySchema = z.object({
    amount_inscription: z.number(),
  });

  const { provider, external_id } = updateAmountInscriptionQuerySchema.parse(req.param());
  const { amount_inscription } = updateAmountInscriptionBodySchema.parse(body);

  const useCase = makeUpdateAmountInscriptionUseCase();

  await useCase.execute({
    env,
    provider,
    external_id: Number(external_id),
    amount_inscription,
  });

  return json({ message: 'Amount inscription updated successfully' }, 200);
};
