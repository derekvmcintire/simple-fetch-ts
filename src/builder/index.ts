import { InvalidMethodBodyError } from "../errors/request-body-error";
import { tsDelete } from "../methods/delete";
import { tsFetch } from "../methods/fetch";
import { tsPatch } from "../methods/patch";
import { tsPost } from "../methods/post";
import { tsPut } from "../methods/put";
import { QueryParams, SimpleResponse } from "../types";
import { serializeQueryParams } from "../utility/url-helpers";

/**
 * A class for creating and executing HTTP requests with a fluent, builder-pattern-based
 * abstraction. SimpleBuilder provides support for common HTTP methods like GET, POST, PUT, PATCH,
 * and DELETE, and allows configuration of headers, query parameters, and request body.
 */
export class SimpleBuilder {
  private url: string;
  private requestBody: unknown = null;
  private requestHeaders: HeadersInit = {};
  private requestParams: string = "";
  private logger: (message: string, error: any) => void;

  /**
   * Constructs a SimpleBuilder instance with a base URL and optional default headers.
   * @param url - The base URL for the request.
   * @param defaultHeaders - Default headers to include in every request.
   * @param logger - Optional custom logger function.
   */
  constructor(
    url: string,
    defaultHeaders: HeadersInit = {},
    logger: (message: string, error: any) => void = console.error,
  ) {
    this.url = url;
    this.requestHeaders = defaultHeaders;
    this.logger = logger;
  }

  /**
   * Sets the request body for the HTTP request.
   * @template T - The type of the body.
   * @param body - The request payload.
   * @returns The current SimpleBuilder instance for method chaining.
   */
  body<T>(body: T): SimpleBuilder {
    this.requestBody = body;
    return this;
  }

  /**
   * Adds or updates headers for the HTTP request.
   * @param requestHeaders - The headers to merge with existing headers.
   * @returns The current SimpleBuilder instance for method chaining.
   */
  headers(requestHeaders: HeadersInit): this {
    this.requestHeaders = { ...this.requestHeaders, ...requestHeaders };
    return this;
  }

  /**
   * Serializes and appends query parameters to the URL.
   * @param requestParams - The query parameters as an object.
   * @param lowerCaseKeys - Whether to convert all parameter keys to lowercase.
   * @returns The current SimpleBuilder instance for method chaining.
   */
  params(requestParams: QueryParams, lowerCaseKeys: boolean = false): this {
    this.requestParams = serializeQueryParams(requestParams, lowerCaseKeys);
    return this;
  }

  /**
   * Builds the final URL by appending query parameters if they exist.
   * @returns The constructed URL with query parameters.
   */
  private buildUrl(): string {
    return this.requestParams ? `${this.url}?${this.requestParams}` : this.url;
  }

  /**
   * Checks if the given headers object is a plain record of key-value pairs.
   * @param headers - The headers object to validate.
   * @returns True if the headers object is a plain record, false otherwise.
   */
  private isHeadersRecord(
    headers: HeadersInit,
  ): headers is Record<string, string> {
    return typeof headers === "object" && !(headers instanceof Headers);
  }

  /**
   * Ensures that the Content-Type header is set to 'application/json' if a request body exists.
   */
  private prepareHeaders(): void {
    if (
      this.isHeadersRecord(this.requestHeaders) &&
      !this.requestHeaders["Content-Type"] &&
      this.requestBody
    ) {
      this.requestHeaders["Content-Type"] = "application/json";
    }
  }

  /**
   * Executes the provided request function and handles errors.
   * Validates that the request body is only used with applicable HTTP methods.
   * @param requestFn - The function to execute the HTTP request.
   * @param method - The HTTP method being used.
   * @returns A promise resolving to the response of the HTTP request.
   * @throws An error if the method is invalid for requests with a body.
   */
  private async handleRequest<T>(
    requestFn: () => Promise<SimpleResponse<T>>,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  ): Promise<SimpleResponse<T>> {
    if (
      !["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
      this.requestBody !== null
    ) {
      throw new InvalidMethodBodyError(method, this.url);
    }

    this.prepareHeaders();

    try {
      return await requestFn();
    } catch (error) {
      this.logger(`Error with ${method} request to ${this.url}:`, error);
      throw error;
    }
  }

  /**
   * Executes a GET request.
   * @template T - The type of the expected response data.
   * @returns A promise resolving to the response of the GET request.
   */
  async fetch<T>(): Promise<SimpleResponse<T>> {
    const fullUrl = this.buildUrl();
    return this.handleRequest(
      () => tsFetch<T>(fullUrl, this.requestHeaders),
      "GET",
    );
  }

  /**
   * Executes a POST request with the configured body and headers.
   * @template T - The type of the expected response data.
   * @returns A promise resolving to the response of the POST request.
   */
  async post<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPost<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "POST",
    );
  }

  /**
   * Executes a PUT request with the configured body and headers.
   * @template T - The type of the expected response data.
   * @returns A promise resolving to the response of the PUT request.
   */
  async put<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPut<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PUT",
    );
  }

  /**
   * Executes a PATCH request with the configured body and headers.
   * @template T - The type of the expected response data.
   * @returns A promise resolving to the response of the PATCH request.
   */
  async patch<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPatch<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PATCH",
    );
  }

  /**
   * Executes a DELETE request with the configured headers.
   * @template T - The type of the expected response data.
   * @returns A promise resolving to the response of the DELETE request.
   */
  async delete<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsDelete<T>(this.buildUrl(), this.requestHeaders),
      "DELETE",
    );
  }
}
