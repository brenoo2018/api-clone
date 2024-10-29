import { QueueRepository } from "../../../domain/repositories/queue-repository";
import { Bindings } from "../../../types/bindings";


export class HttpQueueRepository implements QueueRepository {
  async send(env: Bindings, params: any) {
    await env.API_QUEUE.send(params, { delaySeconds: 2 });
  }
}