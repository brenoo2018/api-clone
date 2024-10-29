import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';

type TotalEventsUseCaseRequest = {
  env: Bindings;
  provider?: string;
  is_active?: boolean;
};
type TotalEventsUseCaseResponse = {
  total_events: number;
};

export class TotalEventsUseCase {
  constructor(private eventsRepository: EventsRepository) { }

  async execute({
    env,
    is_active,
    provider
  }: TotalEventsUseCaseRequest): Promise<TotalEventsUseCaseResponse> {
    const totalEvents = await this.eventsRepository.totalCount(env, provider, is_active);

    return { total_events: totalEvents };
  }
}
