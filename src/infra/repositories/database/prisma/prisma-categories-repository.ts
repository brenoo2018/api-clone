import { Prisma } from '@prisma/client';
import { CategoriesRepository, CategoryWithEventCount } from '../../../../domain/repositories/categories-repository';
import { Bindings } from '../../../../types/bindings';
import { createPrismaClient } from '../../../../utils/create-prisma-client';

export class PrismaCategoriesRepository implements CategoriesRepository {
  async countByCategory(env: Bindings, provider?: string, is_active?: boolean) {
    const prisma = createPrismaClient(env);

    const categoriesWithEventCount = await prisma.$queryRaw<CategoryWithEventCount[]>`
      SELECT 
        c.id, 
        c.title, 
        COUNT(DISTINCT e.id) AS event_count
      FROM categories c
      LEFT JOIN events_categories ec ON c.id = ec.category_id
      LEFT JOIN events e ON e.id = ec.event_id
      WHERE 1=1
      ${is_active !== undefined ? Prisma.sql`AND e.is_active = ${is_active}` : Prisma.empty}
      ${provider ? Prisma.sql`AND e.provider = ${provider}` : Prisma.empty}
      GROUP BY c.id
      ORDER BY event_count DESC
  `;
    return categoriesWithEventCount;

  }
}
