import { z } from 'zod';
import { RouteHandler } from '../../../../types/route-handler';
import { makeDeleteEventUseCase } from '../../../../app/factories/make-delete-event-use-case';

export const deleteEvent: RouteHandler = async ({ json, env, req }) => {
  const body = await req.json();

  if (!body) {
    throw new Error('Body is required');
  }
  const deleteEventParamsSchema = z.object({
    external_id: z.string().trim(),

  });
  const deleteEventBodySchema = z.object({
    reason: z.string().trim(),
    provider: z.string().trim(),
  });

  const { external_id } = deleteEventParamsSchema.parse(req.param());
  const { reason, provider } = deleteEventBodySchema.parse(body);

  const useCase = makeDeleteEventUseCase();

  const response = await useCase.execute({
    env,
    external_id: Number(external_id),
    provider,
    reason,
  });

  return json(response, 200);
};
