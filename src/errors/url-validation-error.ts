/**
 * Custom error class to handle cases where an invalid URL is provided.
 *
 * This error is thrown when a URL fails validation, providing a clear message
 * and guidance for users to ensure proper URL formatting.
 *
 * @extends Error
 */
export class InvalidURLError extends Error {
  /**
   * @param url - The invalid URL that caused the error.
   */
  constructor(url: string) {
    super(
      `A valid URL is required, received: ${url}. Ensure the URL starts with "http://" or "https://".`,
    );
    this.name = "InvalidURLError";
  }
}
