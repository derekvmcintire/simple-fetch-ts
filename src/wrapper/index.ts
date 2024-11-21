import { tsDelete } from "../delete";
import { tsFetch } from "../fetch";
import { tsPatch } from "../patch";
import { tsPost } from "../post";
import { tsPut } from "../put";
import { QueryParams, SimpleResponse } from "../types";
import { serializeQueryParams } from "../utility/url-helpers";

export class FetchWrapper {
  private url: string;
  private requestBody: unknown = null;
  private requestHeaders: HeadersInit = {};
  private requestParams: string = "";

  constructor(url: string, defaultHeaders: HeadersInit = {}) {
    this.url = url;
    this.requestHeaders = defaultHeaders;
  }

  body<T>(body: T): FetchWrapper {
    this.requestBody = body;
    return this;
  }

  headers(requestHeaders: HeadersInit): this {
    this.requestHeaders = { ...this.requestHeaders, ...requestHeaders };
    return this;
  }

  params(requestParams: QueryParams, lowerCaseKeys: boolean = false): this {
    this.requestParams = serializeQueryParams(requestParams, lowerCaseKeys);
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

  private prepareHeaders(): void {
    if (
      this.isHeadersRecord(this.requestHeaders) &&
      !this.requestHeaders["Content-Type"] &&
      this.requestBody
    ) {
      this.requestHeaders["Content-Type"] = "application/json";
    }
  }

  private async handleRequest<T>(
    requestFn: () => Promise<SimpleResponse<T>>,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  ): Promise<SimpleResponse<T>> {
    // Validate requestBody usage
    if (
      !["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
      this.requestBody !== null
    ) {
      throw new Error(`${method} requests should not have a body.`);
    }

    this.prepareHeaders();

    try {
      return await requestFn();
    } catch (error) {
      console.error(`Error with ${method} request to ${this.url}:`, error);
      throw error;
    }
  }

  async fetch<T>(): Promise<SimpleResponse<T>> {
    const fullUrl = this.buildUrl();
    return this.handleRequest(
      () => tsFetch<T>(fullUrl, this.requestHeaders),
      "GET",
    );
  }

  async post<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPost<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "POST",
    );
  }

  async put<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPut<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PUT",
    );
  }

  async patch<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsPatch<T>(this.buildUrl(), this.requestBody, this.requestHeaders),
      "PATCH",
    );
  }

  async delete<T>(): Promise<SimpleResponse<T>> {
    return this.handleRequest(
      () => tsDelete<T>(this.buildUrl(), this.requestHeaders),
      "DELETE",
    );
  }
}
