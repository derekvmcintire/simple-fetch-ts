import { SimpleFetchRequestError } from "../../errors/request-error";
import { SimpleResponse } from "../../types";
import { getContentType } from "../../utility/get-content-type";

/**
 * Performs a typed PATCH request to the specified URL.
 *
 * If the `Content-Type` is set to `application/json` and the body is an object, the body
 * is automatically stringified to JSON format.
 *
 * @template T - The type of the expected response data.
 * @param url - The URL to send the request to.
 * @param requestBody - The data to be sent as the request body.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns A promise that resolves with a SimpleResponse object.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsPatch = async <T>(
  url: string,
  requestBody: any,
  requestHeaders: HeadersInit = {},
  signal?: AbortSignal,
): Promise<SimpleResponse<T>> => {
  const contentType = getContentType(requestHeaders).toLowerCase();

  // Automatically stringify the body if Content-Type is JSON and body is an object
  const body =
    contentType === "application/json" &&
    requestBody &&
    typeof requestBody === "object"
      ? JSON.stringify(requestBody)
      : requestBody;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      body,
      headers: requestHeaders,
      signal,
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "Unable to parse response text");
      throw new SimpleFetchRequestError(
        "PATCH",
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
