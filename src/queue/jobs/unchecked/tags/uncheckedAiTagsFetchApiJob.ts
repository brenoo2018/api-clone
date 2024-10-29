import { Temas, Categorias, CheckedTagsCategories } from "../../../../domain/entities/checked-ai";
import { HttpFetchParams } from "../../../../domain/repositories/request-http-repository";
import { HttpRequestRepository } from "../../../../infra/repositories/http/request-http-repository";
import { Bindings } from "../../../../types/bindings";


export async function uncheckedAiTagsFetchApiJob({
  env,
  fetchParams,
  action,
  delaySeconds
}: { env: Bindings, fetchParams: HttpFetchParams, action: string, delaySeconds: number }) {
  console.log("🚀 ~ fetchParams:", fetchParams)
  const httpRequest = new HttpRequestRepository();

  const response = await httpRequest.search<CheckedTagsCategories>(fetchParams);
  console.log("🚀 ~ response:", response)


  const { temas, categorias, event_id, } = response;

  await env.API_QUEUE.send({
    temas,
    categorias,
    event_id: Number(event_id),
    action
  }, {
    delaySeconds
  });

}