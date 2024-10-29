import { CheckedChristian } from "../../../../domain/entities/checked-ai";
import { HttpFetchParams } from "../../../../domain/repositories/request-http-repository";
import { HttpRequestRepository } from "../../../../infra/repositories/http/request-http-repository";
import { Bindings } from "../../../../types/bindings";
import { reasons } from "../../../../utils/reasons";


export async function uncheckedAiChristianFetchApiJob({
  env,
  fetchParams,
  action
}: { env: Bindings, fetchParams: HttpFetchParams, action: string }) {
  console.log("🚀 ~ fetchParams:", fetchParams)
  const httpRequest = new HttpRequestRepository();

  const response = await httpRequest.search<CheckedChristian>(fetchParams);
  const { cristao, event_id } = response;

  const isNonChristian = cristao === false;

  await env.API_QUEUE.send({
    is_checked_christian: true,
    reason: isNonChristian ? reasons.event_non_christian.normalize : null,
    // is_active: !isNonChristian,
    is_pending: isNonChristian,
    event_id: Number(event_id),
    field: 'is_checked_christian',
    action
  }, {
    delaySeconds: env.DELAY_MILLISECONDS / 1000
  });


}