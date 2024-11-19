import { FetchTsResponse } from "../types";

/**
 * Performs a typed fetch request to the specified URL.
 * @param url - The URL to fetch data from.
 * @returns A promise that resolves with the fetched data, status, and headers.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const typedFetch = async <T>(url: string): Promise<FetchTsResponse<T>> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Network response status ${response.status} with URL: ${url}`,
      );
    }

    const data: T = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};
