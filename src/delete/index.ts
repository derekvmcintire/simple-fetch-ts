import { FetchTsResponse } from "../types";

/**
 * Performs a typed DELETE request to the specified URL.
 * @param url - The URL to send the request to.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns A promise that resolves with the response status and headers.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsDelete = async <T>(
  url: string,
  requestHeaders: HeadersInit = {},
): Promise<FetchTsResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { ...requestHeaders },
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
