import { FetchTsResponse } from "../types";

/**
 * Performs a typed post request to the specified URL.
 * @param url - The URL to fetch data from.
 * @param requestBody - The data to be sent as the request body.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns A promise that resolves with the fetched data, status, and headers.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsPost = async <T>(
  url: string,
  requestBody: any,
  requestHeaders: HeadersInit = {},
): Promise<FetchTsResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      headers: { "Content-Type": "application/json", ...requestHeaders },
    });

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
