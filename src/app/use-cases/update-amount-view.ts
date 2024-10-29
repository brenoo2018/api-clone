import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';
import { Event } from '@prisma/client';

type UpdateAmountViewUseCaseRequest = {
  env: Bindings;
  id: number;
};

export class UpdateAmountViewUseCase {
  constructor(private eventsRepository: EventsRepository) { }
  async execute({
    env,
    id,
  }: UpdateAmountViewUseCaseRequest): Promise<void> {
    await this.eventsRepository.updateAmountView(env, {
      id,
      updated_at: Math.floor(new Date().getTime() / 1000),
    });
  }
}
