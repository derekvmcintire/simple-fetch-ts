export class SimpleFetchRequestError extends Error {
  constructor(
    public method: string,
    public url: string,
    public status?: number,
    public statusText?: string,
    public responseBody?: any
  ) {
    super(
      `${method} request to ${url} failed with status ${
        status ?? "unknown"
      }: ${statusText ?? "No status text"}`
    );
    this.name = "SimpleFetchRequestError";
  }
}

export class InvalidURLError extends Error {
  constructor(url: string) {
    super(`A valid URL is required, received: ${url}`);
    this.name = "InvalidURLError";
  }
}
