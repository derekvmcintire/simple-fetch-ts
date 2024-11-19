export interface FetchTsResult<T> {
  data: T;
  status: number;
  headers: Headers;
}
