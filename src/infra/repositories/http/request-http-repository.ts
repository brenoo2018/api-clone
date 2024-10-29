import { HttpFetchParams, HttpRepository } from "../../../domain/repositories/request-http-repository";


export class HttpRequestRepository implements HttpRepository {
  async search<T>(params: HttpFetchParams, return_text?: boolean) {
    const { url, options, } = params

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const message = `Failed to request: ${response.statusText} - ${response.status} - ${url}`
        console.error(message);
        throw message
      }
      const resultJson = return_text ? await response.text() : await response.json();

      return resultJson as T;

    } catch (error) {
      console.log("🚀 ~ HttpRequestRepository ~ error:", error, { url, options })
      throw error
    }
  }
}
