import { CheckedNFSW } from "../../../../domain/entities/checked-ai";
import { HttpFetchParams } from "../../../../domain/repositories/request-http-repository";
import { HttpRequestRepository } from "../../../../infra/repositories/http/request-http-repository";
import { Bindings } from "../../../../types/bindings";
import { reasons } from "../../../../utils/reasons";


export async function uncheckedAiNSFWFetchApiJob({
  env,
  fetchParams,
  action
}: { env: Bindings, fetchParams: HttpFetchParams, action: string }) {
  console.log("🚀 ~ fetchParams:", fetchParams)
  const httpRequest = new HttpRequestRepository();

  const response = await httpRequest.search<CheckedNFSW>(fetchParams);
  console.log("🚀 ~ response:", response)
  const { invalid_image, description, event_id } = response;


  const hasInvalidImage = invalid_image === true;

  if (event_id) {
    await env.API_QUEUE.send({
      is_checked_nsfw: true,
      reason: hasInvalidImage ? reasons.event_non_nsfw.normalize : null,
      // is_active: !hasInvalidImage,
      is_pending: hasInvalidImage,
      event_id: Number(event_id),
      field: 'is_checked_nsfw',
      action
    }, {
      delaySeconds: env.DELAY_MILLISECONDS / 1000
    });
  }
}