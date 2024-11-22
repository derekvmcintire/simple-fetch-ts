/**
 * Custom error class to represent errors that occur during HTTP requests.
 *
 * Provides detailed information about the failed request, including the HTTP method,
 * URL, status code, status text, and optionally the response body.
 *
 * @extends Error
 */
export class SimpleFetchRequestError extends Error {
  /**
   * @param method - The HTTP method used for the request (e.g., "GET", "POST").
   * @param url - The URL to which the request was made.
   * @param status - Optional HTTP status code returned from the server.
   * @param statusText - Optional status text accompanying the HTTP status code.
   * @param responseBody - Optional response body returned from the server.
   */
  constructor(
    public method: string,
    public url: string,
    public status?: number,
    public statusText?: string,
    public responseBody?: any,
  ) {
    super(
      `${method} request to ${url} failed with status ${
        status ?? "unknown"
      }: ${statusText || "No status text"}`,
    );
    this.name = "SimpleFetchRequestError";
  }
}
