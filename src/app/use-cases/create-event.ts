import { Event, Prisma } from '@prisma/client';
import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';
import { State } from '../../domain/entities/state';
import { City } from '../../domain/entities/city';
import { EventDto } from '../../infra/dto/event-dto';
import { EventsModalitiesRepository } from '../../domain/repositories/events-modalities-repository';
import { EventsCategoriesRepository } from '../../domain/repositories/events-categories-repository';
import { EventsThemesRepository } from '../../domain/repositories/events-themes-repository';
import { cleanHTML } from '../../utils/clean-html';
import { updateEventIfNeeded } from '../../utils/update-field-event-if-needed';
import { normalize } from '../../utils/normalize';

type CreateEventUseCaseRequest = {
  events: EventDto;
  env: Bindings;
  states_and_cities: {
    state: State;
    city: City;
  }[];
};

type CreateEventUseCaseResponse = {
  succeeded: Event[];
  failed: any[];
};

export class CreateEventUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private eventsCategoriesRepository: EventsCategoriesRepository,
    private eventsModalitiesRepository: EventsModalitiesRepository,
    private eventsThemesRepository: EventsThemesRepository
  ) { }

  calculateArrayDifferences(oldArray: number[], newArray: number[]) {
    const toRemove = oldArray.filter(item => !newArray.includes(item)); // IDs a remover
    const toAdd = newArray.filter(item => !oldArray.includes(item));    // IDs a adicionar
    return { toRemove, toAdd };
  }

  async execute({
    env,
    events,
    states_and_cities,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const succeeded: Event[] = [];
    const failed: any[] = [];

    // Usando Promise.allSettled para garantir que todas as operações sejam aguardadas corretamente
    await Promise.allSettled(
      events.map(async (event) => {
        console.log("🚀 ~ CreateEventUseCase ~ events.map ~ event:", event)
        const {
          is_active,
          external_id,
          provider,
          start_at,
          end_at,
          title,
          url_event,
          url_image,
          description,
          is_free,
          local,
          org_name,
          state,
          city,
          latitude,
          longitude,
          amount_inscription,
          event_category,
          event_theme,
          event_modality,
          is_checked_christian,
          is_checked_nsfw,
          is_checked_tags,
        } = event;

        try {
          // Verificar se evento existe pelo external_id e provider
          const eventExists = await this.eventsRepository.searchByExternalId(env, {
            external_id: external_id!,
            provider: provider,
          });
          console.log("🚀 ~ CreateEventUseCase ~ events.map ~ eventExists:", eventExists)

          const stateExists = states_and_cities.find(
            (item) => state && normalize(item.state.uf) === normalize(state)
          );
          const cityExists = states_and_cities.find(
            (item) => city && normalize(item.city.nome) === normalize(city)
          );

          if (eventExists) {


            // console.log("🚀 ~ removed reason and deleted:", eventExists)

            const lat = latitude ? new Prisma.Decimal(latitude) : null;
            const lon = longitude ? new Prisma.Decimal(longitude) : null;
            const latNumber = Number(lat);
            const lonNumber = Number(lon);

            const updateFields = updateEventIfNeeded(eventExists, {
              is_active: eventExists.is_active,
              state: stateExists ? state! : eventExists.state || 'N/A',
              city: cityExists ? city! : eventExists.city || 'N/A',
              local: local || eventExists.local,
              latitude: latNumber,
              longitude: lonNumber,
              start_at,
              end_at,
              title: title || eventExists.title,
              url_event: url_event || eventExists.url_event,
              provider: provider,
              url_image: url_image || eventExists.url_image,
              description: description ? cleanHTML(description) : eventExists.description,
              is_free: is_free !== undefined ? is_free : eventExists.is_free,
              org_name: org_name || eventExists.org_name,
              amount_inscription: amount_inscription !== undefined ? amount_inscription : eventExists.amount_inscription,
            });

            let updatedEvent: Event;

            if (Object.keys(updateFields).length > 0) {
              if (provider === 'einscricao' && eventExists.reason) {
                updateFields.reason = null;
              }

              if (provider === 'einscricao' && eventExists.deleted_at) {
                updateFields.deleted_at = null;
                updateFields.is_active = true;
              }
              console.log('updateFields-->', updateFields)
              updatedEvent = await this.eventsRepository.updateEvent(env, eventExists.id, updateFields);
              succeeded.push(updatedEvent);
            }

            if (event_category && Array.isArray(event_category)) {
              const eventCategory = await this.eventsCategoriesRepository.searchByEventId(env, eventExists.id);

              if (eventCategory.length > 0) {
                await Promise.allSettled(
                  eventCategory.map((item) =>
                    this.eventsCategoriesRepository.deleteByEventId(env, { id: item.id }))
                );
              }

              await Promise.allSettled(
                event_category.map((categoryId) =>
                  this.eventsCategoriesRepository.create(env, {
                    created_at: Math.floor(new Date().getTime() / 1000),
                    updated_at: Math.floor(new Date().getTime() / 1000),
                    event_id: eventExists.id,
                    category_id: categoryId,
                  })
                )
              );
            }
            if (event_theme && Array.isArray(event_theme)) {
              const eventTheme = await this.eventsThemesRepository.searchByEventId(env, eventExists.id);

              if (eventTheme.length > 0) {
                await Promise.allSettled(
                  eventTheme.map((item) =>
                    this.eventsThemesRepository.deleteByEventId(env, { id: item.id }))
                );
              }

              await Promise.all(
                event_theme.map((themeId) =>
                  this.eventsThemesRepository.create(env, {
                    created_at: Math.floor(new Date().getTime() / 1000),
                    updated_at: Math.floor(new Date().getTime() / 1000),
                    event_id: eventExists.id,
                    theme_id: themeId,
                  })
                )
              );
            }
            if (event_modality && Array.isArray(event_modality)) {
              const eventModality = await this.eventsModalitiesRepository.searchByEventId(env, eventExists.id);

              await Promise.allSettled(
                eventModality.map((item) =>
                  this.eventsModalitiesRepository.deleteByEventId(env, { id: item.id }))
              );

              await Promise.allSettled(
                event_modality.map((modalityId) =>
                  this.eventsModalitiesRepository.create(env, {
                    created_at: Math.floor(new Date().getTime() / 1000),
                    updated_at: Math.floor(new Date().getTime() / 1000),
                    event_id: eventExists.id,
                    modality_id: modalityId,
                  })
                )
              );
            }

            return;
          }

          // Cria um novo evento caso não exista
          const newEvent = await this.eventsRepository.createEvent(env, {
            is_active: is_active ?? false,
            amount_inscription: amount_inscription,
            amount_view: 0,
            state: stateExists?.state.uf ?? 'N/A',
            city: stateExists?.city.nome ?? 'N/A',
            start_at,
            end_at,
            title: title,
            url_event: url_event,
            provider: provider,
            url_image: url_image ?? '',
            external_id: external_id,
            description: description ? cleanHTML(description) : null,
            is_free: is_free,
            local: local,
            org_name: org_name ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            created_at: Math.floor(new Date().getTime() / 1000),
            updated_at: Math.floor(new Date().getTime() / 1000),
            is_checked_christian: is_checked_christian ?? false,
            is_checked_nsfw: is_checked_nsfw ?? false,
            is_checked_tags: is_checked_tags ?? false
          });

          if (event_category && Array.isArray(event_category)) {
            await Promise.all(
              event_category.map((categoryId) =>
                this.eventsCategoriesRepository.create(env, {
                  created_at: Math.floor(new Date().getTime() / 1000),
                  updated_at: Math.floor(new Date().getTime() / 1000),
                  event_id: newEvent.id,
                  category_id: categoryId,
                })
              )
            );
          }
          if (event_theme && Array.isArray(event_theme)) {
            await Promise.all(
              event_theme.map((themeId) =>
                this.eventsThemesRepository.create(env, {
                  created_at: Math.floor(new Date().getTime() / 1000),
                  updated_at: Math.floor(new Date().getTime() / 1000),
                  event_id: newEvent.id,
                  theme_id: themeId,
                })
              )
            );
          }
          if (event_modality && Array.isArray(event_modality)) {
            await Promise.all(
              event_modality.map((modalityId) =>
                this.eventsModalitiesRepository.create(env, {
                  created_at: Math.floor(new Date().getTime() / 1000),
                  updated_at: Math.floor(new Date().getTime() / 1000),
                  event_id: newEvent.id,
                  modality_id: modalityId,
                })
              )
            );
          }

          succeeded.push(newEvent);
        } catch (error) {
          console.log("🚀 ~ CreateEventUseCase ~ events.map ~ error:", error)
          failed.push({ event, error });
        }
      })
    );

    return { succeeded, failed };
  }
}

