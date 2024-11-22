import { SimpleResponse } from "../types";
import { getContentType } from "../utility/get-content-type";

/**
 * Performs a typed PATCH request to the specified URL.
 * @param url - The URL to send the request to.
 * @param requestBody - The data to be sent as the request body.
 * @param requestHeaders - Optional headers to be sent with the request.
 * @returns A promise that resolves with the response data, status, and headers.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsPatch = async <T>(
  url: string,
  requestBody: any,
  requestHeaders: HeadersInit = {},
): Promise<SimpleResponse<T>> => {
  // Get Content-Type header and ensure it's lowercase
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
