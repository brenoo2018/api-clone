import { makeCreateEventUseCase } from '../../../../app/factories/make-create-event-use-case';
import { RouteHandler } from '../../../../types/route-handler';
import { makeSearchCitiesUseCase } from '../../../../app/factories/make-search-cities-use-case';
import { createEventBodySchema, EventDto } from '../../../dto/event-dto';

export const create: RouteHandler = async ({ json, env, req }) => {
  const body = await req.json();

  if (!body || !Array.isArray(body)) {
    throw new Error('An array of event objects is required');
  }

  let validatedEvents: EventDto = [];
  let invalidEvents: any[] = [];

  try {
    validatedEvents = createEventBodySchema.parse(body);
  } catch (error: any) {
    invalidEvents = error.errors;
  }

  const createUseCase = makeCreateEventUseCase();
  const searchUseCase = makeSearchCitiesUseCase();
  const { states_and_cities } = searchUseCase.execute();

  const { succeeded, failed } = await createUseCase.execute({
    events: validatedEvents,
    env,
    states_and_cities,
  });

  console.log('retornooo', { succeeded, failed, invalid: invalidEvents });

  return json(
    {
      succeeded,
      failed,
      invalid: invalidEvents,
    },
    201 // 207 Multi-Status, pois temos múltiplos resultados de sucesso/falha.
  );
};
