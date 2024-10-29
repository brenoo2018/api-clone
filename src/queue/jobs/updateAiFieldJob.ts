import { UpdateEventsByAIUseCase } from "../../app/use-cases/update-events-by-ai";
import { PrismaEventsAiRepository } from "../../infra/repositories/database/prisma/prisma-events-ai-repository";
import { PrismaEventsThemesRepository } from "../../infra/repositories/database/prisma/prisma-events-themes-repository";
import { PrismaEventsCategoriesRepository } from "../../infra/repositories/database/prisma/prisma-events-categories-repository";
import { Bindings } from "../../types/bindings";

export async function updateAiFieldJob({
  env,
  event_id,
  field,
  is_checked_christian,
  is_checked_nsfw,
  is_checked_tags,
  reason,
  is_active,
  is_pending,
  event_category,
  event_theme
}: {
  env: Bindings;
  event_id: number;
  field: string;
  is_checked_christian?: boolean;
  is_checked_nsfw?: boolean;
  is_checked_tags?: boolean;
  reason?: string;
  is_active?: boolean;
  is_pending?: boolean;
  event_category: number[];
  event_theme: number[];
}) {

  console.log('vai chamar o update-->', {
    event_id,
    field,
    is_checked_christian,
    is_checked_nsfw,
    is_checked_tags,
    reason,
    is_active,
    is_pending
  })


  const prismaEventsAiRepository = new PrismaEventsAiRepository();

  const prismaEventsThemesRepository = new PrismaEventsThemesRepository();
  const prismaEventsCategoriesRepository = new PrismaEventsCategoriesRepository();

  const updateEventsByAIUseCase = new UpdateEventsByAIUseCase(prismaEventsAiRepository, prismaEventsThemesRepository, prismaEventsCategoriesRepository);

  await updateEventsByAIUseCase.execute({
    env,
    event_id,
    field,
    is_checked_christian,
    is_checked_nsfw,
    is_checked_tags,
    is_active,
    is_pending,
    reason,
    event_category,
    event_theme
  });
}