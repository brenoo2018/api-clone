import {
  EventsAiRepository,
  TPropsSearchEventsByUncheckedChristian,
  TPropsSearchEventsByUncheckedNSFW,
  TPropsSearchEventsByUncheckedTAGS,
  TPropsUpdateByChristian,
  TPropsUpdateByNSFW,
  TPropsUpdateByTAGS
} from "../../../../domain/repositories/events-ai-repository";
import { createPrismaClient } from "../../../../utils/create-prisma-client";

export class PrismaEventsAiRepository
  implements EventsAiRepository {
  async updateCheckedChristian(params: TPropsUpdateByChristian) {
    const { env, is_checked_christian, event_id, reason, is_pending } = params;
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: {
        id: Number(event_id),
      },
      data: {
        is_checked_christian,
        reason,
        is_pending
      },
    });

  }
  async updateCheckedNSFW(params: TPropsUpdateByNSFW) {
    const { env, is_checked_nsfw, event_id, reason, is_pending } = params;
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: {
        id: Number(event_id),
      },
      data: {
        is_checked_nsfw,
        reason,
        is_pending
      },
    });
  }
  async updateCheckedTags(params: TPropsUpdateByTAGS) {
    const { env, is_checked_tags, deleted_at, event_id, reason, is_active, is_pending } = params;
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: {
        id: Number(event_id),
      },
      data: {
        is_checked_tags,
        reason,
        is_active,
        is_pending
      },
    });
  }
  async searchByUncheckedChristian(params: TPropsSearchEventsByUncheckedChristian) {
    const { env, is_checked_christian, limit, page } = params;
    const prisma = createPrismaClient(env);

    const events = await prisma.event.findMany({
      select: { id: true, title: true, description: true, org_name: true, local: true },
      where: {
        OR: [
          { is_checked_christian: { equals: false } },
          { is_checked_christian: { equals: null } }
        ],
        // provider: {
        //   not: 'einscricao'
        // },
        is_active: false,
        is_pending: false
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return events;
  }
  async searchByUncheckedNSFW(params: TPropsSearchEventsByUncheckedNSFW) {
    const { env, is_checked_nsfw, limit, page } = params;
    const prisma = createPrismaClient(env);

    const events = await prisma.event.findMany({
      select: { id: true, url_image: true },
      where: {
        url_image: {
          not: ""
        },
        // provider: {
        //   not: 'einscricao'
        // },
        OR: [
          { is_checked_nsfw: { equals: false } },
          { is_checked_nsfw: { equals: null } }
        ],
        is_checked_christian: true,
        is_pending: false
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return events;
  }
  async searchByUncheckedTags(params: TPropsSearchEventsByUncheckedTAGS) {
    const { env, is_checked_tags, limit, page } = params;
    const prisma = createPrismaClient(env);

    const events = await prisma.event.findMany({
      select: { id: true, title: true, description: true, org_name: true, local: true },
      where: {
        // provider: {
        //   not: 'einscricao'
        // },
        OR: [
          { is_checked_tags: { equals: false } },
          { is_checked_tags: { equals: null } }
        ],
        is_checked_christian: true,
        is_checked_nsfw: true,
        is_pending: false
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return events;
  }

}