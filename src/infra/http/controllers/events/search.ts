import { z } from 'zod';
import { makeSearchEventsUseCase } from '../../../../app/factories/make-search-events-use-case';
import { RouteHandler } from '../../../../types/route-handler';
import {
  convertDateToUnixEpochMidnight,
  getStartAndEndOfDay,
} from '../../../../utils/dates';
import { makeSearchEventsNearbyUseCase } from '../../../../app/factories/make-search-events-nearby-use-case';

export const search: RouteHandler = async ({ json, env, req }) => {
  const searchEventsQuerySchema = z.object({
    query: z.string().trim().optional(),
    state: z.string().length(2).toUpperCase().optional(),
    city: z.string().trim().optional(),
    ordenation: z.enum(['amount_view', 'start_at', 'title']).optional(),
    modality_id: z.string().trim().optional(),
    category_id: z.string().trim().optional(),
    theme_id: z.string().trim().optional(),
    is_free: z.enum(['true', 'false']).optional(),
    start_at: z.string().trim().optional(),
    end_at: z.string().trim().optional(),
    provider: z.string().trim().optional(),
    is_active: z.enum(['true', 'false']).optional(),
    latitude: z.string().trim().optional(),
    longitude: z.string().trim().optional(),
    section: z.enum(['trending', 'most-accessed', 'starting-in-few-days', 'new-events', 'nearby']).optional(),
    page: z.string().trim().default('1'),
    limit: z.string().trim().default('10'),
    reason: z.enum(['event_finished', 'event_deleted', 'event_non_christian', 'event_non_nsfw', 'event_non_tags']).optional(),
    id: z.string().trim().optional(),
    external_id: z.string().trim().optional(),
    ids: z.string().trim().optional(),
  });



  const {
    query,
    state,
    city,
    modality_id,
    ordenation,
    category_id,
    theme_id,
    is_free,
    start_at,
    end_at,
    page,
    limit,
    is_active,
    provider,
    latitude,
    longitude,
    section,
    reason,
    id,
    external_id,
    ids
  } = searchEventsQuerySchema.parse(req.query());


  const start_at_unix_epoch = start_at ? getStartAndEndOfDay('filter', undefined, start_at) : undefined;
  const end_at_unix_epoch = end_at ? getStartAndEndOfDay('filter', undefined, end_at) : undefined;
  // const start_at_unix_epoch = start_at ? convertDateToUnixEpochMidnight(start_at) : undefined;
  // const end_at_unix_epoch = end_at ? convertDateToUnixEpochMidnight(end_at) : undefined;
  const is_active_boolean = is_active === 'true' ? true : is_active === 'false' ? false : undefined;
  const is_free_boolean = is_free === 'true' ? true : is_free === 'false' ? false : undefined;
  const idsArray = ids?.split(',')
    .map((id) => Number(id.trim()))  // Converte para número
    .filter((id) => !isNaN(id));     // Remove valores inválidos (NaN)

  if (section === 'nearby' && ((latitude && longitude) || state || city)) {
    const searchNearbyUseCase = makeSearchEventsNearbyUseCase();
    const response = await searchNearbyUseCase.execute({
      env,
      query,
      state,
      city,
      ordenation: ordenation,
      modality_id: Number(modality_id),
      category_id: Number(category_id),
      theme_id: Number(theme_id),
      is_free: is_free_boolean,
      start_at: start_at_unix_epoch?.start,
      end_at: end_at_unix_epoch?.end,
      page: Number(page),
      limit: Number(limit),
      is_active: is_active_boolean,
      provider,
      section,
      latitude: Number(latitude),
      longitude: Number(longitude),
      reason,
      id: Number(id),
      external_id: Number(external_id),
    });

    return json(response, 200);
  }

  const searchUseCase = makeSearchEventsUseCase();

  const response = await searchUseCase.execute({
    env,
    query,
    state,
    city,
    ordenation: ordenation,
    modality_id: Number(modality_id),
    category_id: Number(category_id),
    theme_id: Number(theme_id),
    is_free: is_free_boolean,
    start_at: start_at_unix_epoch?.start,
    end_at: end_at_unix_epoch?.end,
    page: Number(page),
    limit: Number(limit),
    is_active: is_active_boolean,
    provider,
    section,
    latitude: Number(latitude),
    longitude: Number(longitude),
    reason,
    id: Number(id),
    external_id: Number(external_id),
    ids: idsArray
  });

  return json(response, 200);
};
