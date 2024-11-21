# Documentation

`simple-fetch-ts` is a TypeScript library designed to simplify HTTP requests using a builder-pattern approach. It provides a fluent API for creating, configuring, and executing various HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with type safety and centralized error handling.

---

## Installation

Install the library via npm:

```bash
npm install simple-fetch-ts
```

---

## Key Features

- **Fluent Builder API**: Chainable methods for setting headers, query parameters, and body data.
- **Type-Safe Responses**: Strongly typed responses ensure compile-time safety.
- **Simplified Query Parameter Handling**: Automatic serialization of query parameters.
- **Centralized Error Handling**: Consistent error messages for all HTTP methods.
- **Lightweight**: Built with native `fetch` under the hood.

---

## Usage

### Importing the Library

```typescript
import { simple } from "simple-fetch-ts";
```

### Quick Start

1. **Creating a Fetch Wrapper Instance**

   Use the `simple` factory function to validate the URL and instantiate a `FetchWrapper`.

   ```typescript
   import { QueryParams, simple } from "simple-fetch-ts";

   const api = simple("https://api.example.com/resource");
   ```

2. **Configuring the Request**

   Chain methods to configure headers, query parameters, and request body:

   ```typescript
   const myFilters = { page: 1, limit: 10, orderBy: 'id' };
   const params = myFilters as QueryParams;
   const convertToLowerCase = true;
   const wrapper = api
     .headers({ Authorization: "Bearer token" })
     .params(params, convertToLowerCase) // v1.0.5 - added optional flag to convert queryParams to lowercase
     .body<BodyType>({ name: "example" }); // v1.0.5 - added generic Typing to .body()
   ```

3. **Sending the Request**

   Choose an HTTP method to execute the request:

   ```typescript
   const response = await wrapper.post<ExpectedReturnType>();
   const myData = response.data;
   console.log(myData);
   ```

4. **All Together Now...**

   ```typescript
   const response = await simple("https://api.example.com/resource")
      .headers({ Authorization: "Bearer token" })
      .params(params, convertToLowerCase)
      .body<BodyType>({ name: "example" })
      .post<ExpectedReturnType>();

   console.log(response.data)
   ```

---

## SimpleFetch

If you want an inflexible, but quick way to make a simple fetch request, you can use simpleTsFetch. simpleFetch skips the response object and returns your parsed
data directly. It uses the same fetch helper as the factory function, handling errors internally.

```typescript
import { simpleFetch } from "simple-fetch-ts";

// data is parsed and ready to consume, but there is no access to the response object
const response = await simpleFetch<ExpectedReturnType[]>(
  "https://api.example.com/resource",
);
console.log(response);
```

---

## API Reference

### `simple(url: string): FetchWrapper`

- **Description**: Factory function that creates a `FetchWrapper` instance.
- **Parameters**:
  - `url` (`string`): The base URL for the API.
- **Throws**: Error if the provided URL is invalid.
- **Returns**: A `FetchWrapper` instance.

---

### Class: `FetchWrapper`

The core class for building and executing HTTP requests.

#### Constructor

```typescript
constructor(url: string, defaultHeaders?: HeadersInit)
```

- **Parameters**:
  - `url` (`string`): The base URL for the API.
  - `defaultHeaders` (`HeadersInit`): Optional default headers.

---

#### Methods

##### `headers(requestHeaders: HeadersInit): this`

- Adds or updates request headers.

##### `params(requestParams: QueryParams): this`

- Serializes and appends query parameters to the URL.

##### `body(requestBody: any): this`

- Sets the request body. Automatically assigns `Content-Type: application/json` if not provided.

##### `fetch<T>(): Promise<SimpleResponse<T>>`

- Executes a `GET` request.

##### `post<T>(): Promise<SimpleResponse<T>>`

- Executes a `POST` request with the configured body and headers.

##### `put<T>(): Promise<SimpleResponse<T>>`

- Executes a `PUT` request with the configured body and headers.

##### `patch<T>(): Promise<SimpleResponse<T>>`

- Executes a `PATCH` request with the configured body and headers.

##### `delete<T>(): Promise<SimpleResponse<T>>`

- Executes a `DELETE` request with the configured headers.

---

## Utility Functions

The library includes helper functions for low-level HTTP requests. These are internally used by `FetchWrapper`.

### `tsFetch<T>(url: string): Promise<SimpleResponse<T>>`

Performs a `GET` request.

### `tsPost<T>(url: string, requestBody: any, requestHeaders?: HeadersInit): Promise<SimpleResponse<T>>`

Performs a `POST` request.

### `tsPut<T>(url: string, requestBody: any, requestHeaders?: HeadersInit): Promise<SimpleResponse<T>>`

Performs a `PUT` request.

### `tsPatch<T>(url: string, requestBody: any, requestHeaders?: HeadersInit): Promise<SimpleResponse<T>>`

Performs a `PATCH` request.

### `tsDelete<T>(url: string, requestHeaders?: HeadersInit): Promise<SimpleResponse<T>>`

Performs a `DELETE` request.

---

## Types

### `SimpleResponse<T>`

```typescript
interface SimpleResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}
```

---

## Examples

### Step By Step

```typescript
import { simple } from "simple-fetch-ts";

// Create a wrapper instance
const api = simple("https://api.example.com/resource");

// Configure the request
const wrapper = api
  .headers({ Authorization: "Bearer token" })
  .params({ page: 1, limit: 10 })
  .body({ name: "example" });

// Send a POST request
const response = await wrapper.post<{ id: string; name: string }>();

console.log("Data:", response.data);
console.log("Status:", response.status);
console.log("Headers:", response.headers);
```

### Simple Post

```typeScript
const result = await simple("https://api.example.com/resource")
  .body({ name: "example", location: "example" })
  .post<ExpectedReturnType>(); // no need to set "Content-Type" if there is a body, it will automatically be set to "application/json"

return result.data;
```

### Equivelant Code Using Native Fetch

```typescript
const url = "https://api.example.com/resource";
try {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ name: "example", location: "example" }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return {
      error: `Network response status ${response.status} with url ${url}`,
    };
  }

  const parsedResponse: ExpectedReturnType = await response.json();

  return parsedResponse;
} catch (error: unknown) {
  throw new Error(
    error instanceof Error ? error.message : "An unknown error occurred",
  );
}
```

---

## Error Handling

The library ensures consistent error messages for invalid configurations or failed requests. Errors are thrown as `Error` objects with detailed messages.

---

## tsFetch Function

Both `simpleTsFetch()` and `simple.fetch()` use `tsFetch()`:

```typescript
/**
 * Performs a typed fetch request to the specified URL.
 * @param url - The URL to fetch data from.
 * @returns A promise that resolves with the fetched data, status, and headers.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 */
export const tsFetch = async <T>(
  url: string,
  requestHeaders: HeadersInit = {},
): Promise<SimpleResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "GET",
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
```

---

## License

This library is licensed under the [ISC License](./LICENSE).

---
