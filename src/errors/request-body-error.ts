/**
 * Custom error class for invalid HTTP method-body combination.
 * @extends Error
 */
export class InvalidMethodBodyError extends Error {
  public method: string;
  public url: string;

  /**
   * @param method - The HTTP method (GET, POST, PUT, PATCH, DELETE).
   * @param url - The URL the request was being made to.
   */
  constructor(method: string, url: string) {
    super(`${method} requests should not have a body. Request made to: ${url}`);
    this.name = "InvalidMethodBodyError";
    this.method = method;
    this.url = url;
  }
}
