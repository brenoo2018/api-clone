import { Prisma, Research } from '@prisma/client';
import { Bindings } from '../../types/bindings';

export interface ResearchesRepository {
  create(
    env: Bindings,
    data: Prisma.ResearchUncheckedCreateInput
  ): Promise<Research>;
}
