import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';

type UpdateAmountInscriptionUseCaseRequest = {
  env: Bindings;
  external_id: number;
  provider: string;
  amount_inscription: number;
};

export class UpdateAmountInscriptionUseCase {
  constructor(private eventsRepository: EventsRepository) { }
  async execute({
    env,
    external_id,
    provider,
    amount_inscription
  }: UpdateAmountInscriptionUseCaseRequest): Promise<void> {

    const event = await this.eventsRepository.searchByExternalId(env, {
      external_id,
      provider,
    });

    if (!event) {
      throw new Error('Event not found')
    }

    return await this.eventsRepository.updateAmountInscription(env, {
      id: event.id,
      amount_inscription,
      updated_at: Math.floor(new Date().getTime() / 1000),
    });
  }
}
