# Documentation

`simple-fetch-ts` is a TypeScript library designed to simplify HTTP requests using a builder-pattern approach. It provides a fluent API for creating, configuring, and executing various HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with type safety and centralized error handling.

It was written and is maintained by me, Derek. Contribution information is at the bottom of this document.

---

## Installation

Install the library via npm:

```bash
npm install simple-fetch-ts
```
- Package Size: 6.0 kB (compressed)
- Unpacked Size: 22.9 kB (after installation)

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

   Use the `simple` factory function to validate the URL and instantiate a `SimpleBuilder`.

   ```typescript
   import { QueryParams, simple } from "simple-fetch-ts";

   const api = simple("https://api.example.com/resource");
   ```

2. **Configuring the Request**

   Chain methods to configure headers, query parameters, and request body:

   ```typescript
   const myFilters = { page: 1, limit: 10, orderBy: "id" };
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

   console.log(response.data);
   ```

---

## simpleFetch

If you want an inflexible, but quick way to make a simple fetch request, you can use simpleFetch. simpleFetch skips the response object and returns your parsed
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

### `simple(url: string): SimpleBuilder`

- **Description**: Factory function that creates a `SimpleBuilder` instance.
- **Parameters**:
  - `url` (`string`): The base URL for the API.
- **Throws**: Error if the provided URL is invalid.
- **Returns**: A `SimpleBuilder` instance.

---

### Class: `SimpleBuilder`

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

The library includes helper functions for low-level HTTP requests. These are internally used by `SimpleBuilder`.

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

## Test Coverage
### Update as of Version 1.0.5 (Nov. 21, 2024)

As part of maintaining high-quality standards, **`simple-fetch-ts`** ensures robust testing with extensive test coverage across its features. The library leverages **Jest** for unit and integration testing, providing confidence in functionality and stability. Here’s a detailed overview of the test coverage:

#### Summary
- **Test Suites**: 10
- **Tests**: 51
- **Snapshots**: 0
- **Execution Time**: ~9.5 seconds
- **Overall Coverage**:
  - **Statements**: 98.61%
  - **Branches**: 81.6%
  - **Functions**: 100%
  - **Lines**: 98.49%

#### Detailed File Coverage
| File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|-----------------------|---------|----------|---------|---------|-------------------|
| **All files**         | **98.61** | **81.6** | **100** | **98.49** |                   |
| `builder/index.ts`    | 100      | 100      | 100     | 100     |                   |
| `methods/delete`      | 100      | 75       | 100     | 100     | 14                |
| `methods/fetch`       | 100      | 100      | 100     | 100     |                   |
| `methods/patch`       | 100      | 55.55    | 100     | 100     | 20-26             |
| `methods/post`        | 100      | 55.55    | 100     | 100     | 20-26             |
| `methods/put`         | 100      | 55.55    | 100     | 100     | 17-24             |
| `simple-factory`      | 100      | 100      | 100     | 100     |                   |
| `simple-fetch`        | 100      | 83.33    | 100     | 100     | 15                |
| `utility`             | 94.44    | 93.75    | 100     | 93.75   |                   |
| └ `get-content-type.ts` | 90.9   | 100      | 100     | 90      | 26                |
| └ `url-helpers.ts`     | 96     | 89.47    | 100     | 95.45   | 56                |

#### Observations
- **High overall coverage**: As of version 1.0.5, the library demonstrates near-complete coverage for statements, functions, and lines.
- **Branch coverage**: Slightly lower branch coverage (81.6%) highlights opportunities for additional tests, particularly in conditional logic within methods like `patch`, `post`, and `put`.
- **Uncovered lines**:
  - Conditional handling in `delete`, `patch`, `post`, and `put` methods.
  - Specific utility edge cases in `get-content-type.ts` and `url-helpers.ts`.

#### Testing Philosophy
This high coverage ensures the reliability and accuracy of core features, such as HTTP methods (`GET`, `POST`, `PATCH`, `PUT`, and `DELETE`), utility functions, and the library's factory functions. By focusing on both typical and edge cases, **`simple-fetch-ts`** is designed to handle a variety of scenarios with minimal risk of failure.

#### Future Improvements
- Increasing branch coverage by adding tests for uncovered conditions.
- Monitoring coverage metrics in CI/CD workflows to maintain high standards with every update.

#### How to Run Tests
You can replicate these results by running the following command:
```bash
npm run test
```
This will execute all test suites and generate a coverage report. To view coverage details:
```bash
npm run test:coverage
```

By committing to comprehensive testing, **`simple-fetch-ts`** ensures a reliable and user-friendly library for developers.

---

### Contributing to **`simple-fetch-ts`**

Contributions are welcome from the community to help improve **`simple-fetch-ts`**! Whether you have ideas for new features, fixes for bugs, or improvements to documentation, your input is valuable and appreciated.

#### How to Contribute
1. **Fork the Repository**:  
   Begin by forking the repository to your GitHub account.

2. **Clone the Repository**:  
   Clone your forked repository locally:
   ```bash
   git clone https://github.com/<your-username>/simple-fetch-ts.git
   cd simple-fetch-ts
   ```

3. **Create a New Branch**:  
   Create a branch for your feature or fix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

4. **Make Your Changes**:  
   - Write clear, concise, and maintainable code.
   - Include tests for new features or fixes.
   - Update documentation if necessary.

5. **Run Tests**:  
   Ensure all tests pass before submitting your changes:
   ```bash
   npm run test
   ```

6. **Submit a Pull Request**:  
   Push your branch to GitHub and open a pull request against the `main` branch of the original repository.  
   In your pull request:
   - Clearly describe the changes made.
   - Reference any related issues or feature requests.

#### Contribution Guidelines
To maintain a high-quality codebase, we ask contributors to adhere to the following:
- Follow the existing code style and structure.
- Write meaningful commit messages (e.g., `Fix: Handle edge case in tsPatch`).
- Ensure any added functionality is covered by tests.
- Keep pull requests focused on a single change whenever possible.

#### Reporting Issues
If you encounter a bug or have a suggestion, please open an issue on the [GitHub repository](https://github.com/derekvmcintire/simple-fetch-ts/issues).  
Provide as much detail as possible, including steps to reproduce bugs or a clear explanation of the feature request.

#### Acknowledgments
Thank you for taking the time to support this project and being a part of the open-source community.

---

## License

This library is licensed under the [ISC License](./LICENSE).

---
