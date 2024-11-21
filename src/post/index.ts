import { SimpleResponse } from "..";
import { getContentType } from "../utility/get-content-type";

export const tsPost = async <T>(
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
      method: "POST",
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
