import { z } from 'zod';
import { RouteHandler } from '../../../../types/route-handler';
import { makeCreateResearchUseCase } from '../../../../app/factories/make-create-research-use-case';

export const create: RouteHandler = async ({ json, env, req }) => {
  const body = await req.json();

  if (!body) {
    throw new Error('Body is required');
  }
  const createResearchBodySchema = z.object({
    query: z.string().trim().optional(),
    filter: z.string().trim().optional(),
    latitude: z.string().trim().optional(),
    longitude: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
  });

  const { query, filter, latitude, longitude, city, state } =
    createResearchBodySchema.parse(body);

  const useCase = makeCreateResearchUseCase();

  const { research } = await useCase.execute({
    env,
    query,
    filter,
    latitude: Number(latitude),
    longitude: Number(longitude),
    city,
    state,
  });

  return json({ research }, 200);
};
