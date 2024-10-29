import { UpdateEventsByAIUseCase } from "../../../../app/use-cases/update-events-by-ai";
import { Bindings } from "../../../../types/bindings";
import { PrismaEventsAiRepository } from "../../../repositories/database/prisma/prisma-events-ai-repository";
import { PrismaEventsCategoriesRepository } from "../../../repositories/database/prisma/prisma-events-categories-repository";
import { PrismaEventsThemesRepository } from "../../../repositories/database/prisma/prisma-events-themes-repository";

export async function updateEventsByAi(
  { env,
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
    env: Bindings,
    event_id: number,
    field: string,
    is_checked_christian?: boolean,
    is_checked_nsfw?: boolean,
    is_checked_tags?: boolean,
    reason?: string,
    is_active?: boolean,
    is_pending?: boolean,
    event_category?: number[],
    event_theme?: number[],
  }
) {
  const prismaEventsAiRepository = new PrismaEventsAiRepository();
  const prismaEventsCategoriesRepository = new PrismaEventsCategoriesRepository();
  const prismaEventsThemesRepository = new PrismaEventsThemesRepository();

  const updateEventsByAIUseCase = new UpdateEventsByAIUseCase(prismaEventsAiRepository, prismaEventsThemesRepository, prismaEventsCategoriesRepository);

  await updateEventsByAIUseCase.execute({
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
  });

  return new Response(JSON.stringify({ message: 'success' }), { status: 200 });

}