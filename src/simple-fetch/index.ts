import { tsFetch } from "../methods/fetch";

/**
 * Fetches data from the given URL and returns the data part of the response.
 * @param url - The URL to fetch data from.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns The data returned from the fetch.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const simpleFetch = async <T>(
  url: string,
  requestHeaders: HeadersInit = {},
): Promise<T> => {
  const result = await tsFetch<T>(url, requestHeaders);
  if (!result?.data) {
    throw new Error(`No data returned from the fetch for URL: ${url}`);
  }
  return result.data;
};
