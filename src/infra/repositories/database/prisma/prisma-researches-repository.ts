import { Prisma } from '@prisma/client';
import { ResearchesRepository } from '../../../../domain/repositories/research-repository';
import { Bindings } from '../../../../types/bindings';
import { createPrismaClient } from '../../../../utils/create-prisma-client';

export class PrismaResearchesRepository implements ResearchesRepository {
  async create(env: Bindings, data: Prisma.EventCategoryUncheckedCreateInput) {
    const prisma = createPrismaClient(env);
    const research = await prisma.research.create({ data });
    return research;
  }
}
