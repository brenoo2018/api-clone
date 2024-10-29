import { Bindings } from "../../types/bindings";

export interface QueueRepository {
  send(env: Bindings, params: any): Promise<void>
}