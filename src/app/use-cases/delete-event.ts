import { EventsRepository } from '../../domain/repositories/events-repository';
import { Bindings } from '../../types/bindings';
import { Event } from '@prisma/client';
import { reasons } from '../../utils/reasons';

type DeleteEventUseCaseRequest = {
  env: Bindings;
  external_id: number;
  provider: string;
  reason: string;
};

type DeleteEventUseCaseResponse = {
  message: string;
};

type TPropsRemove = {
  id: number;
  deleted_at?: number;
  is_active: boolean;
  reason: string,
  is_pending?: boolean
}

export class DeleteEventUseCase {
  constructor(private eventsRepository: EventsRepository) { }
  async execute({
    env,
    external_id,
    provider,
    reason,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const normalizeValue = reasons[reason as keyof typeof reasons].normalize;

    const findEvent = await this.eventsRepository.searchByExternalId(env, { external_id, provider });

    if (!findEvent) throw new Error('Event not found');

    let remove: TPropsRemove = {
      id: findEvent.id,
      is_active: false,
      reason: normalizeValue,
    }

    if (normalizeValue === reasons.event_deleted.normalize ||
      normalizeValue === reasons.event_finished.normalize
    ) {
      remove.deleted_at = Math.floor(new Date().getTime() / 1000);
    }

    await this.eventsRepository.deleteEvent(env, remove);

    return { message: 'Evento removido com sucesso' };
  }
}
