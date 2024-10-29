import { Prisma } from '@prisma/client';
import {
  EventsRepository,
  TPropsSearchManyNearbyParams,
  TPropsSearchEvents,
} from '../../../../domain/repositories/events-repository';
import { Bindings } from '../../../../types/bindings';
import { SearchEventByExternalId, SearchEventsPrisma } from '../../../../domain/entities/events';
import { createPrismaClient } from '../../../../utils/create-prisma-client';
import { escapeSpecialCharacters } from '../../../../utils/scape-query';
import { convertUnixEpochToDateBrazilian } from '../../../../utils/dates';

export class PrismaEventsRepository implements EventsRepository {

  async createEvent(env: Bindings, data: Prisma.EventUncheckedCreateInput) {
    const prisma = createPrismaClient(env);
    return await prisma.event.create({ data });
  }
  async updateEvent(env: Bindings, id: number, data: Prisma.EventUncheckedUpdateInput) {
    const prisma = createPrismaClient(env);

    const event = await prisma.event.update({
      where: { id },
      data,
    });

    return event;
  }
  async updateAmountView(
    env: Bindings,
    { id, updated_at }: { id: number; updated_at: number }
  ) {
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: { id },
      data: {
        amount_view: {
          increment: 1,
        },
        updated_at,
      },
    });
  }

  async updateAmountInscription(
    env: Bindings,
    { id, amount_inscription, updated_at }:
      { id: number; amount_inscription: number; updated_at: number }
  ) {
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: { id },
      data: {
        amount_inscription,
        updated_at,
      },
    });
  }

  async deleteEvent(
    env: Bindings,
    {
      id,
      is_active,
      deleted_at,
      reason,
      is_pending
    }: { id: number; deleted_at?: number; is_active: boolean; reason: string, is_pending?: boolean }
  ) {
    const prisma = createPrismaClient(env);

    await prisma.event.update({
      where: { id: id },
      data: { is_active, deleted_at, reason, is_pending },
    });

  }

  async searchManyNearby(
    env: Bindings,
    params: TPropsSearchManyNearbyParams
  ) {
    console.log("🚀 repository search many nearby", params);
    const {
      latitude,
      longitude,
      distance,
      query,
      state,
      city,
      modality_id,
      category_id,
      theme_id,
      is_free,
      start_at,
      end_at,
      provider,
      limit,
      page,
      is_active,
      ordenation,
    } = params;

    const prisma = createPrismaClient(env);

    let wildcard = '';
    if (query) {
      const escapedQuery = escapeSpecialCharacters(query);
      wildcard = `${escapedQuery}*`
    }

    const offset = (page - 1) * limit;

    const defineOrderBy = ordenation
      ? `ORDER BY ${ordenation === 'title'
        ? `TRIM(REPLACE(REPLACE(REPLACE(e.title, '"', ''), '!', ''), '?', '')) COLLATE NOCASE`
        : `e.${ordenation}`}`
      : ` ORDER BY 
          CASE 
            WHEN e.provider = 'einscricao' THEN 0 ELSE 1 
          END, 
          e.provider, distance, e.city, e.state`;

    const nearby = await prisma.$queryRaw<SearchEventsPrisma[]>`
      SELECT 
      e.id,
      e.state,
      e.city,
      e.start_at,
      e.end_at,
      e.amount_inscription,
      e.amount_view,
      e.is_free,
      CAST(e.latitude AS DECIMAL) AS latitude,
      CAST(e.longitude AS DECIMAL) AS longitude,
      e.local,
      e.org_name,
      TRIM(e.title) AS title,
      e.url_event,
      e.url_image,
      e.provider,
      GROUP_CONCAT(DISTINCT em.modality_id) AS modality_ids,
      (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(e.latitude)) *
          cos(radians(e.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(e.latitude))
        )
      ) AS distance
      FROM events e
      LEFT JOIN events_categories ec ON e.id = ec.event_id
      LEFT JOIN events_themes et ON e.id = et.event_id
      LEFT JOIN events_modalities em ON e.id = em.event_id
      WHERE 1=1
      ${latitude && longitude && distance ? Prisma.sql`AND (
        6371 * acos(
        cos(radians(${latitude})) * cos(radians(e.latitude)) *
        cos(radians(e.longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(e.latitude))
      )
      ) <= 50` : Prisma.empty}
      ${query ? Prisma.sql`AND e.id IN (${Prisma.sql`
        SELECT rowid
        FROM v_events ve
        WHERE 1 = 1
        AND ve.title MATCH ${wildcard} OR ve.description MATCH ${wildcard}`
        }
        )` : Prisma.empty}
      ${state ? Prisma.sql`AND e.state = ${state}` : Prisma.empty}
      ${city ? Prisma.sql`AND e.city = ${city}` : Prisma.empty}
      ${modality_id ? Prisma.sql`AND em.modality_id = ${modality_id}` : Prisma.empty}
      ${category_id ? Prisma.sql`AND ec.category_id = ${category_id}` : Prisma.empty}
      ${theme_id ? Prisma.sql`AND et.theme_id = ${theme_id}` : Prisma.empty}
      ${is_free !== undefined ? Prisma.sql`AND e.is_free = ${is_free}` : Prisma.empty}
      ${provider ? Prisma.sql`AND e.provider = ${provider}` : Prisma.empty}
      ${is_active !== undefined ? Prisma.sql`AND e.is_active = ${is_active}` : Prisma.empty}
      ${start_at && end_at ? Prisma.sql`AND e.start_at BETWEEN ${start_at} AND ${end_at}` : Prisma.empty}
      GROUP BY e.id 
      ${Prisma.raw(defineOrderBy)} 
      ${ordenation === 'amount_view' ? Prisma.sql`DESC` : Prisma.sql`ASC`}
      LIMIT ${Prisma.sql`${limit}`} OFFSET ${Prisma.sql`${offset}`}
    `;

    const countNearby = await prisma.$queryRaw<[{ total: number }]>`
      SELECT COUNT(DISTINCT e.id) as total
      FROM events e
      LEFT JOIN events_categories ec ON e.id = ec.event_id
      LEFT JOIN events_themes et ON e.id = et.event_id
      LEFT JOIN events_modalities em ON e.id = em.event_id
      WHERE 1=1
      ${latitude && longitude && distance ? Prisma.sql`
      AND (
        6371 * acos(
        cos(radians(${latitude})) * cos(radians(e.latitude)) *
        cos(radians(e.longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(e.latitude))
        )
      ) <= 50` : Prisma.empty}
      ${query ? Prisma.sql`AND e.id IN (${Prisma.sql`
        SELECT rowid
        FROM v_events ve
        WHERE 1 = 1
        AND ve.title MATCH ${wildcard} OR ve.description MATCH ${wildcard}`
        }
        )` : Prisma.empty}
      ${state ? Prisma.sql`AND e.state = ${state}` : Prisma.empty}
      ${city ? Prisma.sql`AND e.city = ${city}` : Prisma.empty}
      ${modality_id ? Prisma.sql`AND em.modality_id = ${modality_id}` : Prisma.empty}
      ${category_id ? Prisma.sql`AND ec.category_id = ${category_id}` : Prisma.empty}
      ${theme_id ? Prisma.sql`AND et.theme_id = ${theme_id}` : Prisma.empty}
      ${is_free !== undefined ? Prisma.sql`AND e.is_free = ${is_free}` : Prisma.empty}
      ${provider ? Prisma.sql`AND e.provider = ${provider}` : Prisma.empty}
      ${is_active !== undefined ? Prisma.sql`AND e.is_active = ${is_active}` : Prisma.empty}
      ${start_at && end_at ? Prisma.sql`AND e.start_at BETWEEN ${start_at} AND ${end_at}` : Prisma.empty}
    `;

    // Processa os resultados para transformar as strings de IDs em arrays
    const events = nearby.map((event: any) => ({
      ...event,
      start_at: convertUnixEpochToDateBrazilian(event.start_at, event.provider),
      end_at: convertUnixEpochToDateBrazilian(event.end_at, event.provider),
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
      modality_ids: event.modality_ids ? event.modality_ids.split(',').map(Number) : [],
      // created_at: convertUnixEpochToDateBrazilian(rest.created_at),
      // updated_at: convertUnixEpochToDateBrazilian(rest.updated_at),
      // category_ids: EventCategory ? EventCategory?.map((ec: any) => ec.category_id) : event.category_ids,
      // theme_ids: EventTheme ? EventTheme?.map((et: any) => et.theme_id) : event.theme_ids,
    }));

    return { events, count: countNearby[0]?.total || 0 };
  }


  async search(
    env: Bindings,
    params: TPropsSearchEvents
  ) {
    const {
      query,
      state,
      city,
      modality_id,
      ordenation,
      ordenationSection,
      category_id,
      theme_id,
      is_free,
      start_at,
      end_at,
      page,
      limit,
      is_active,
      provider,
      section,
      reason,
      id,
      external_id,
      fourteenDaysAgo,
      thirtyDaysAgo,
      thirtyDaysLater,
      today,
      ids
    } = params;
    console.log("🚀 repository search events", params);

    let wildcard = '';
    if (query) {
      const escapedQuery = escapeSpecialCharacters(query);
      wildcard = `${escapedQuery} * `
    }

    const offset = (page - 1) * limit;

    let orderBy = `
    ORDER BY
      CASE 
        WHEN strftime('%Y', datetime(e.start_at, 'unixepoch')) = strftime('%Y', datetime('now', 'localtime'))
        THEN 0
        ELSE 1
      END,
    `;

    const withOrdenation = `${ordenation === 'title'
      ? `TRIM(REPLACE(REPLACE(REPLACE(e.title, '"', ''), '!', ''), '?', '')) COLLATE NOCASE`
      : `e.${ordenation} ${ordenation === `amount_view` ? `DESC` : `ASC`}`}`;

    const withOrdenationSection = `
    CASE 
      WHEN e.provider = 'einscricao' 
      THEN 0 
      ELSE 1 
    END,
    e.provider ${ordenationSection
        && ordenationSection === 'amount_view'
        || ordenationSection === 'amount_inscription'
        ? `,e.${ordenationSection} DESC`
        : `${ordenationSection ? `,e.${ordenationSection}` : 'ASC'}`}
    `;

    orderBy = `${orderBy} ${ordenation ? withOrdenation : withOrdenationSection}`
    console.log("🚀 ~ PrismaEventsRepository ~ orderBy:", orderBy)

    const prisma = createPrismaClient(env);

    const fiveDaysAgo = today && today - (5 * 24 * 60 * 60);

    const events = await prisma.$queryRaw<SearchEventsPrisma[]>`
      SELECT
      e.id,
      e.state,
      e.city,
      e.start_at,
      e.end_at,
      e.amount_inscription,
      e.amount_view,
      e.is_free,
      CAST(e.latitude AS DECIMAL) AS latitude,
      CAST(e.longitude AS DECIMAL) AS longitude,
      e.local,
      e.org_name,
      TRIM(e.title) AS title,
      e.url_event,
      e.url_image,
      e.provider,
      GROUP_CONCAT(DISTINCT em.modality_id) AS modality_ids
      FROM events e
      ${category_id ? Prisma.sql`LEFT JOIN events_categories ec ON e.id = ec.event_id` : Prisma.empty}
      ${theme_id ? Prisma.sql`LEFT JOIN events_themes et ON e.id = et.event_id` : Prisma.empty} 
      LEFT JOIN events_modalities em ON e.id = em.event_id
      WHERE 1 = 1
      ${query ? Prisma.sql`AND e.id IN (${Prisma.sql`
        SELECT rowid
        FROM v_events ve
        WHERE 1 = 1
        AND ve.title MATCH ${wildcard} OR ve.description MATCH ${wildcard}`
        }
        )` : Prisma.empty}
      ${state ? Prisma.sql`AND e.state = ${state}` : Prisma.empty}
      ${city ? Prisma.sql`AND e.city = ${city}` : Prisma.empty}
      ${modality_id ? Prisma.sql`AND em.modality_id = ${modality_id}` : Prisma.empty}
      ${category_id ? Prisma.sql`AND ec.category_id = ${category_id}` : Prisma.empty}
      ${theme_id ? Prisma.sql`AND et.theme_id = ${theme_id}` : Prisma.empty}
      ${is_free !== undefined ? Prisma.sql`AND e.is_free = ${is_free}` : Prisma.empty}
      ${provider ? Prisma.sql`AND e.provider = ${provider}` : Prisma.empty}
      ${is_active !== undefined ? Prisma.sql`AND e.is_active = ${is_active}` : Prisma.empty}
      ${reason ? Prisma.sql`AND e.reason = ${reason}` : Prisma.empty}
      ${id ? Prisma.sql`AND e.id = ${id}` : Prisma.empty}
      ${external_id ? Prisma.sql`AND e.external_id = ${external_id}` : Prisma.empty}
      ${ids && ids.length > 0 ? Prisma.sql`AND e.id IN (${Prisma.join(ids)})` : Prisma.empty}
      ${fourteenDaysAgo ? Prisma.sql`AND e.created_at BETWEEN ${fourteenDaysAgo} AND ${today}` : Prisma.empty}
      ${thirtyDaysAgo ? Prisma.sql`AND e.created_at >= ${thirtyDaysAgo}` : Prisma.empty}
      ${start_at && end_at ? Prisma.sql`AND e.start_at BETWEEN ${start_at} AND ${end_at}` : Prisma.empty}
      ${today && thirtyDaysLater ? Prisma.sql`
        AND (
          (
            -- Eventos que começam entre hoje e 30 dias no futuro
            e.start_at BETWEEN ${today} AND ${thirtyDaysLater}
          )
          OR (
            -- Eventos longos que começaram há 5 dias ou menos e ainda não terminaram
            e.start_at <= ${today} 
            AND e.end_at >= ${today} 
            AND e.start_at >= ${today - 5 * 24 * 60 * 60} -- 5 dias atrás
          )
        )` : Prisma.empty}

      GROUP BY e.id 
      ${Prisma.raw(orderBy)}
      LIMIT ${Prisma.sql`${limit}`} OFFSET ${Prisma.sql`${offset}`}
    `;
    // ${start_at && end_at ? Prisma.sql`AND e.start_at BETWEEN ${start_at} AND ${end_at}` : Prisma.empty}

    // AND (
    //   (e.start_at BETWEEN ${start_at} AND ${end_at})
    //   OR (e.end_at BETWEEN ${start_at} AND ${end_at})
    //   OR (e.start_at >= ${start_at} AND e.end_at <= ${end_at})
    // )


    const count = await prisma.$queryRaw<[{ total: number }]>`
      SELECT COUNT(DISTINCT e.id) AS total
      FROM events e
      ${category_id ? Prisma.sql`LEFT JOIN events_categories ec ON e.id = ec.event_id` : Prisma.empty}
      ${theme_id ? Prisma.sql`LEFT JOIN events_themes et ON e.id = et.event_id` : Prisma.empty} 
      LEFT JOIN events_modalities em ON e.id = em.event_id
      WHERE 1 = 1
      ${query ? Prisma.sql`AND e.id IN (${Prisma.sql`
        SELECT rowid
        FROM v_events ve
        WHERE 1 = 1
        AND ve.title MATCH ${wildcard} OR ve.description MATCH ${wildcard}`
        }
        )` : Prisma.empty}
      ${state ? Prisma.sql`AND e.state = ${state}` : Prisma.empty}
      ${city ? Prisma.sql`AND e.city = ${city}` : Prisma.empty}
      ${modality_id ? Prisma.sql`AND em.modality_id = ${modality_id}` : Prisma.empty}
      ${category_id ? Prisma.sql`AND ec.category_id = ${category_id}` : Prisma.empty}
      ${theme_id ? Prisma.sql`AND et.theme_id = ${theme_id}` : Prisma.empty}
      ${is_free !== undefined ? Prisma.sql`AND e.is_free = ${is_free}` : Prisma.empty}
      ${provider ? Prisma.sql`AND e.provider = ${provider}` : Prisma.empty}
      ${is_active !== undefined ? Prisma.sql`AND e.is_active = ${is_active}` : Prisma.empty}
      ${reason ? Prisma.sql`AND e.reason = ${reason}` : Prisma.empty}
      ${id ? Prisma.sql`AND e.id = ${id}` : Prisma.empty}
      ${external_id ? Prisma.sql`AND e.external_id = ${external_id}` : Prisma.empty}
      ${ids ? Prisma.sql`AND e.id IN (${Prisma.join(ids)})` : Prisma.empty}
      ${fourteenDaysAgo ? Prisma.sql`AND e.created_at >= ${fourteenDaysAgo}` : Prisma.empty}
      ${thirtyDaysAgo ? Prisma.sql`AND e.created_at >= ${thirtyDaysAgo}` : Prisma.empty}
      ${start_at && end_at ? Prisma.sql`AND e.start_at BETWEEN ${start_at} AND ${end_at}` : Prisma.empty}
      ${today && thirtyDaysLater ? Prisma.sql`
        AND (
          (
            -- Eventos que começam entre hoje e 30 dias no futuro
            e.start_at BETWEEN ${today} AND ${thirtyDaysLater}
          )
          OR (
            -- Eventos longos que começaram há 5 dias ou menos e ainda não terminaram
            e.start_at <= ${today} 
            AND e.end_at >= ${today}
            AND e.start_at >= ${fiveDaysAgo} -- 5 dias atrás

          )
        )` : Prisma.empty}
    `;


    const formattedEvents = events.map((event) => ({
      ...event,
      start_at: convertUnixEpochToDateBrazilian(event.start_at, event.provider),
      end_at: convertUnixEpochToDateBrazilian(event.end_at, event.provider),
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
      modality_ids: event.modality_ids ? event.modality_ids.split(',').map(Number) : [],
      // modality_ids: EventModality ? EventModality?.map((et: any) => et.modality_id) : event.modality_ids,
      // created_at: convertUnixEpochToDateBrazilian(rest.created_at),
      // updated_at: convertUnixEpochToDateBrazilian(rest.updated_at),
      // category_ids: EventCategory ? EventCategory?.map((ec: any) => ec.category_id) : event.category_ids,
      // theme_ids: EventTheme ? EventTheme?.map((et: any) => et.theme_id) : event.theme_ids,
    }));

    return { events: formattedEvents, count: count[0]?.total || 0 };

  }

  async searchByExternalId(
    env: Bindings,
    { external_id, provider }: { external_id: number; provider: string }
  ) {
    const prisma = createPrismaClient(env);

    const event = await prisma.event.findFirst({
      where: {
        external_id,
        provider,
      },
      select: {
        id: true,
        is_active: true,
        title: true,
        description: true,
        state: true,
        city: true,
        local: true,
        latitude: true,
        longitude: true,
        start_at: true,
        end_at: true,
        url_event: true,
        url_image: true,
        is_free: true,
        amount_inscription: true,
        amount_view: true,
        updated_at: true,
        org_name: true,
        reason: true,
        provider: true,
        deleted_at: true,
      }
    });

    if (event) {
      event.latitude = event.latitude ? new Prisma.Decimal(event.latitude) : null;
      event.longitude = event.longitude ? new Prisma.Decimal(event.longitude) : null;
    }

    return event as SearchEventByExternalId;
  }

  async searchByExpire(env: Bindings, todayDate: number) {
    const prisma = createPrismaClient(env);

    const events = await prisma.event.findMany({
      where: {
        // is_active: true,
        end_at: {
          lt: todayDate
        },
        deleted_at: null
      }
    });
    return events;
  }
  async searchBanners(env: Bindings, ids: number[]) {
    const prisma = createPrismaClient(env);

    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        url_event: true,
        url_image: true,
      },
      where: {
        // is_active: true,
        id: {
          in: ids
        },
      }
    });

    return { events };
  }

  async totalCount(env: Bindings, provider?: string, is_active?: boolean) {
    const prisma = createPrismaClient(env);

    const totalCount = await prisma.event.count({
      where: {
        ...(provider && { provider }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    return totalCount;
  }
}
