export interface SimpleResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  raw: Response;
}

export type QueryParams = Record<string, string | number | (string | number)[]>;
