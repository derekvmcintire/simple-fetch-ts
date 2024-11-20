import { tsDelete } from "../delete";
import { tsFetch } from "../fetch";
import { tsPatch } from "../patch";
import { tsPost } from "../post";
import { tsPut } from "../put";
import { QueryParams, serializeQueryParams } from "../simple/helpers";
import { FetchTsResponse } from "../types";

/**
 * FetchWrapper
 *
 * This class provides a fluent, builder-pattern-based abstraction for making HTTP requests.
 * It simplifies working with various HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
 * and allows chaining of configurations such as setting headers, request body, and query parameters.
 *
 * Key Features:
 * - Chainable methods (`body`, `headers`, `params`) for configuring requests.
 * - Automatically handles query parameter serialization.
 * - Ensures proper Content-Type handling for requests with a body.
 * - Centralized error handling and validation for consistent behavior across all requests.
 * - Utilizes helper functions (`tsFetch`, `tsPost`, etc.) to execute requests.
 *
 * Usage:
 * ```typescript
 * const wrapper = new FetchWrapper("https://api.example.com/resource")
 *   .headers({ Authorization: "Bearer token" })
 *   .params({ page: 1, limit: 10 })
 *   .body({ name: "example" });
 *
 * const response = await wrapper.post<MyResponseType>();
 * console.log(response.data);
 * ```
 */
export class FetchWrapper {
  private url: string;
  private requestBody: any;
  private requestHeaders: HeadersInit = {};
  private requestParams: string = "";

  constructor(url: string, defaultHeaders: HeadersInit = {}) {
    this.url = url;
    this.requestHeaders = defaultHeaders;
  }

  body(requestBody: any): this {
    this.requestBody = requestBody;
    return this;
  }

  headers(requestHeaders: HeadersInit): this {
    this.requestHeaders = { ...this.requestHeaders, ...requestHeaders };
    return this;
  }

  params(requestParams: QueryParams): this {
    this.requestParams = serializeQueryParams(requestParams);
    return this;
  }

  private buildUrl(): string {
    return this.requestParams ? `${this.url}?${this.requestParams}` : this.url;
  }

  private async handleRequest<T>(
    requestFn: () => Promise<FetchTsResponse<T>>,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  ): Promise<FetchTsResponse<T>> {
    // Validate requestBody usage
    if (
      !["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
      this.requestBody
    ) {
      throw new Error(`${method} requests should not have a body.`);
    }

    // Validate headers if needed
    if (
      typeof this.requestHeaders === "object" &&
      !(this.requestHeaders instanceof Headers)
    ) {
      const headersRecord = this.requestHeaders as Record<string, string>;
      if (!headersRecord["Content-Type"] && this.requestBody) {
        // @TODO consider better logging strategies
        console.warn(
          `Request body detected without Content-Type header. Defaulting to application/json.`,
        );
        headersRecord["Content-Type"] = "application/json";
      }
      this.requestHeaders = headersRecord;
    }

    try {
      return await requestFn();
    } catch (error) {
      // @TODO consider better logging strategies
      console.error(`Error with ${method} request to ${this.url}:`, error);
      throw error;
    }
  }

  async fetch<T>(): Promise<FetchTsResponse<T>> {
    const fullUrl = this.buildUrl();
    return this.handleRequest(() => tsFetch<T>(fullUrl), "GET");
  }

  async post<T>(): Promise<FetchTsResponse<T>> {
    return this.handleRequest(
      () => tsPost<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "POST",
    );
  }

  async put<T>(): Promise<FetchTsResponse<T>> {
    return this.handleRequest(
      () => tsPut<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PUT",
    );
  }

  async patch<T>(): Promise<FetchTsResponse<T>> {
    return this.handleRequest(
      () => tsPatch<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PATCH",
    );
  }

  async delete<T>(): Promise<FetchTsResponse<T>> {
    return this.handleRequest(
      () => tsDelete<T>(this.buildUrl(), this.requestHeaders),
      "DELETE",
    );
  }
}
