import { Bindings } from "../../../../types/bindings";

export async function uncheckedAiNSFWDetailJob({
  env,
  event,
  action,
  delaySeconds
}: { env: Bindings, event: any, action: string, delaySeconds: number }) {
  await env.API_QUEUE.send({ event, action }, { delaySeconds })
}