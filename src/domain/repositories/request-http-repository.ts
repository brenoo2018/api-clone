export type HttpFetchParams = {
  url: string,
  options: {
    method: string,
    headers?: any,
    body?: any,
  }
};
export interface HttpRepository {
  search<T>(params: HttpFetchParams, is_d1?: boolean): Promise<T>
}