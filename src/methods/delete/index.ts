import { SimpleFetchRequestError } from "../../errors/request-error";
import { SimpleResponse } from "../../types";

/**
 * Performs a typed DELETE request to the specified URL.
 *
 * @template T - The type of the expected response data.
 * @param url - The URL to send the request to.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns A promise that resolves with a SimpleResponse object.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsDelete = async <T>(
  url: string,
  requestHeaders: HeadersInit = {},
  signal?: AbortSignal,
): Promise<SimpleResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { ...requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "Unable to parse response text");
      throw new SimpleFetchRequestError(
        "DELETE",
        url,
        response.status,
        response.statusText,
        errorText,
      );
    }

    const data: T = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
      raw: response,
    };
  } catch (error: unknown) {
    if (error instanceof SimpleFetchRequestError) {
      throw error; // Rethrow for consistent handling upstream
    }
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};
