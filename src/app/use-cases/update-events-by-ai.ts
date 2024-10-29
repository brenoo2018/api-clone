import { EventsAiRepository } from "../../domain/repositories/events-ai-repository";
import { EventsCategoriesRepository } from "../../domain/repositories/events-categories-repository";
import { EventsThemesRepository } from "../../domain/repositories/events-themes-repository";
import { Bindings } from "../../types/bindings";

type UpdateEventsByAIUseCaseRequest = {
  env: Bindings;
  event_id: number;
  field: string;
  is_checked_christian?: boolean;
  is_checked_nsfw?: boolean;
  is_checked_tags?: boolean;
  reason?: string;
  is_active?: boolean;
  is_pending?: boolean;
  event_category?: number[];
  event_theme?: number[];
};

export class UpdateEventsByAIUseCase {
  constructor(
    private eventsAiRepository: EventsAiRepository,
    private eventsThemesRepository: EventsThemesRepository,
    private eventsCategoriesRepository: EventsCategoriesRepository,
  ) { }

  async execute({
    env,
    event_id,
    field,
    is_checked_christian,
    is_checked_nsfw,
    is_checked_tags,
    reason,
    is_active,
    is_pending,
    event_theme,
    event_category

  }: UpdateEventsByAIUseCaseRequest): Promise<void> {
    console.log('Alguém me chamou-->', {
      event_id,
      field,
      is_checked_christian,
      is_checked_nsfw,
      is_checked_tags,
      reason,
      is_active,
      is_pending,
      event_theme,
      event_category
    });

    // const deleted_at = reason ? Math.floor(new Date().getTime() / 1000) : null

    if (field === 'is_checked_christian') {
      return await this.eventsAiRepository.updateCheckedChristian({ env, event_id, is_checked_christian, reason, is_pending });
    }
    if (field === 'is_checked_nsfw') {
      return await this.eventsAiRepository.updateCheckedNSFW({ env, event_id, is_checked_nsfw, reason, is_pending });
    }
    if (field === 'is_checked_tags') {
      if (Array.isArray(event_category)) {

        const eventCategory = await this.eventsCategoriesRepository.searchByEventId(env, event_id);

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
              event_id,
              category_id: Number(categoryId),
            })
          )
        );
      }
      if (Array.isArray(event_theme)) {

        const eventTheme = await this.eventsThemesRepository.searchByEventId(env, event_id);

        if (eventTheme.length > 0) {
          await Promise.allSettled(
            eventTheme.map((item) =>
              this.eventsThemesRepository.deleteByEventId(env, { id: item.id }))
          );
        }

        await Promise.allSettled(
          event_theme.map((themeId) =>
            this.eventsThemesRepository.create(env, {
              created_at: Math.floor(new Date().getTime() / 1000),
              updated_at: Math.floor(new Date().getTime() / 1000),
              event_id,
              theme_id: Number(themeId),
            })
          )
        );
      }

      return await this.eventsAiRepository.updateCheckedTags({ env, event_id, is_checked_tags, reason, is_active, is_pending });
    }
  }
}