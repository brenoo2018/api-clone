import { Bindings } from "../types/bindings";
import { consumer } from "./consumer";
import { consumerDlq } from "./dlq";


export async function queue(batch: MessageBatch, env: Bindings) {
  switch (batch.queue) {
    case 'api-queue':
      // Consumidor da fila principal
      await consumer(batch, env);
      break;
    case 'api-queue-dev':
      // Consumidor da fila principal
      await consumer(batch, env);
      break;
    case 'dlq-queue-dev':
      // Consumidor da Dead Letter Queue
      await consumerDlq(batch, env);
      break;
    case 'dlq-queue':
      // Consumidor da Dead Letter Queue
      await consumerDlq(batch, env);
      break;
    default:
      console.warn(`Fila desconhecida: ${batch.queue}`);
  }
}
