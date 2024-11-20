import {
  validateQueryParams,
  serializeQueryParams,
  QueryParams,
  isValidURL,
} from "./helpers";

describe("validateQueryParams", () => {
  it("should throw an error if params is not a plain object", () => {
    expect(() => validateQueryParams([])).toThrow(
      "Query parameters must be a plain object.",
    );
    expect(() => validateQueryParams(null)).toThrow(
      "Query parameters must be a plain object.",
    );
    expect(() => validateQueryParams(123)).toThrow(
      "Query parameters must be a plain object.",
    );
    expect(() => validateQueryParams("string")).toThrow(
      "Query parameters must be a plain object.",
    );
  });

  it("should throw an error if a value is not a string, number, or an array of them", () => {
    expect(() => validateQueryParams({ key: {} })).toThrow(
      'Invalid query parameter value for key "key": Only strings, numbers, or arrays of these are allowed.',
    );

    expect(() => validateQueryParams({ key: [1, 2, true] })).toThrow(
      'Invalid query parameter value for key "key": Only strings, numbers, or arrays of these are allowed.',
    );
  });

  it("should not throw an error for valid params", () => {
    expect(() => validateQueryParams({ key: "value" })).not.toThrow();
    expect(() => validateQueryParams({ key: 123 })).not.toThrow();
    expect(() => validateQueryParams({ key: ["val1", 2] })).not.toThrow();
  });
});

describe("serializeQueryParams", () => {
  beforeEach(() => {
    // Mock the module containing validateQueryParams and ensure we can mock the function
    jest.mock("./helpers", () => ({
      ...jest.requireActual("./helpers"), // Retain all other functions as they are
      validateQueryParams: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should serialize query parameters correctly", () => {
    const params: QueryParams = { name: "John", age: 30 };
    const serialized = serializeQueryParams(params);
    expect(serialized).toBe("name=John&age=30");
  });

  it("should serialize array values as repeated key-value pairs", () => {
    const params: QueryParams = { ids: [1, 2, 3] };
    const serialized = serializeQueryParams(params);
    expect(serialized).toBe("ids=1&ids=2&ids=3");
  });
});

describe("isValidURL", () => {
  it("should return true for valid URLs", () => {
    expect(isValidURL("https://example.com")).toBe(true);
    expect(isValidURL("http://localhost:3000")).toBe(true);
    expect(isValidURL("ftp://files.example.com")).toBe(true);
  });

  it("should return false for invalid URLs", () => {
    expect(isValidURL("invalid-url")).toBe(false);
    expect(isValidURL("https://")).toBe(false);
    expect(isValidURL("ftp://")).toBe(false);
  });
});
