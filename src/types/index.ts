export interface FetchTsResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}
