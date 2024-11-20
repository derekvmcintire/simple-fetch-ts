import { tsDelete } from "../delete";
import { tsFetch } from "../fetch";
import { tsPatch } from "../patch";
import { tsPost } from "../post";
import { tsPut } from "../put";
import { QueryParams, serializeQueryParams } from "../utility/helpers";
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

  private isHeadersRecord(
    headers: HeadersInit,
  ): headers is Record<string, string> {
    return typeof headers === "object" && !(headers instanceof Headers);
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
    if (this.isHeadersRecord(this.requestHeaders)) {
      // Now TypeScript knows this.requestHeaders is a Record<string, string>
      const headersRecord = this.requestHeaders;

      // Check for Content-Type header
      if (!headersRecord["Content-Type"] && this.requestBody) {
        headersRecord["Content-Type"] = "application/json";
      }

      // Here we need to explicitly cast `headersRecord` back to `HeadersInit`
      this.requestHeaders = headersRecord as HeadersInit; // Cast it explicitly
    }

    try {
      return await requestFn();
    } catch (error) {
      console.error(`Error with ${method} request to ${this.url}:`, error);
      throw error;
    }
  }

  async fetch<T>(): Promise<FetchTsResponse<T>> {
    const fullUrl = this.buildUrl();
    return this.handleRequest(
      () => tsFetch<T>(fullUrl, this.requestHeaders),
      "GET",
    );
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
