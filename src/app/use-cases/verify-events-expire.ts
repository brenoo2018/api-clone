import { EventsRepository } from "../../domain/repositories/events-repository";
import { Bindings } from "../../types/bindings";
import { reasons } from "../../utils/reasons";

type VerifyEventExpireUseCaseRequest = {
  env: Bindings;
};

export class VerifyEventExpireUseCase {
  constructor(
    private eventsRepository: EventsRepository,
  ) { }

  async execute({ env }: VerifyEventExpireUseCaseRequest) {

    const today = Math.floor(
      new Date().getTime() / 1000
    );

    const events = await this.eventsRepository.searchByExpire(env, today);
    console.log("🚀 ~ VerifyEventExpireUseCase", events.length)

    if (events.length === 0) return;

    await Promise.allSettled(
      events.map((event) =>
        this.eventsRepository.deleteEvent(env, {
          id: event.id,
          reason: reasons.event_finished.normalize,
          is_active: false,
          deleted_at: Math.floor(new Date().getTime() / 1000),
        }))
    );
  }
}