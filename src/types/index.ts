export interface SimpleResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export type QueryParams = Record<string, string | number | (string | number)[]>;
