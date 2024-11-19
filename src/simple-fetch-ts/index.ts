import { typedFetch } from "../fetch-ts";

/**
 * Fetches data from the given URL and returns the data part of the response.
 * @param url - The URL to fetch data from.
 * @returns The data returned from the fetch.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const simpleTsFetch = async <T>(url: string): Promise<T> => {
  const result = await typedFetch<T>(url);
  if (!result?.data) {
    throw new Error(`No data returned from the fetch for URL: ${url}`);
  }
  return result.data;
};
