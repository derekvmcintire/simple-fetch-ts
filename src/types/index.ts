export interface SimpleResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}
