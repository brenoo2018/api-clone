import { Bindings } from '../../../../types/bindings';
import { VerifyEventExpireUseCase } from '../../../../app/use-cases/verify-events-expire';
import { PrismaEventsRepository } from '../../../repositories/database/prisma/prisma-events-repository';

export async function verifyEventExpire(env: Bindings) {

  const prismaEventsRepository = new PrismaEventsRepository();

  const verifyEventExpireUseCase = new VerifyEventExpireUseCase(prismaEventsRepository);

  await verifyEventExpireUseCase.execute({
    env,
  });

  return new Response(JSON.stringify({ message: 'Eventos removidos com sucesso' }), { status: 200 });
};
