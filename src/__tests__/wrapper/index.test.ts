import { FetchWrapper } from "../../wrapper";
import { tsFetch } from "../../fetch";
import { tsPost } from "../../post";
import { tsPut } from "../../put";
import { tsPatch } from "../../patch";
import { tsDelete } from "../../delete";
import { serializeQueryParams } from "../../utility/helpers";

const mockResponse = {
  data: { message: "response" }, // Mocked data
  status: 200, // Mocked status code
  headers: new Headers({
    "Content-Type": "application/json",
  }),
};

// Mock the helper functions
jest.mock("../../fetch", () => ({
  tsFetch: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../post", () => ({
  tsPost: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../put", () => ({
  tsPut: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../patch", () => ({
  tsPatch: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../delete", () => ({
  tsDelete: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));

describe("FetchWrapper", () => {
  let fetchWrapper: FetchWrapper;
  const mockUrl = "https://api.example.com/resource";
  const mockHeaders = { Authorization: "Bearer token" };
  const mockParams = { page: 1, limit: 10 };
  const mockBody = { name: "example" };

  beforeEach(() => {
    fetchWrapper = new FetchWrapper(mockUrl);
  });

  it("should initialize with a URL and optional headers", () => {
    expect(fetchWrapper).toBeInstanceOf(FetchWrapper);
    expect(fetchWrapper["url"]).toBe(mockUrl);
    expect(fetchWrapper["requestHeaders"]).toEqual({});
  });

  it("should allow method chaining with body, headers, and params", () => {
    fetchWrapper.body(mockBody).headers(mockHeaders).params(mockParams);
    expect(fetchWrapper["requestBody"]).toBe(mockBody);
    expect(fetchWrapper["requestHeaders"]).toEqual(mockHeaders);
    expect(fetchWrapper["requestParams"]).toBe(
      serializeQueryParams(mockParams),
    );
  });

  it("should build the correct URL with query parameters", () => {
    fetchWrapper.params(mockParams);
    const builtUrl = fetchWrapper["buildUrl"]();
    expect(builtUrl).toBe(`${mockUrl}?page=1&limit=10`);
  });

  describe("handleRequest", () => {
    it("should throw an error for methods that should not have a body", async () => {
      fetchWrapper.body(mockBody);
      await expect(fetchWrapper.fetch()).rejects.toThrow(
        "GET requests should not have a body.",
      );
    });

    it("should add Content-Type header if not present and body is provided", async () => {
      fetchWrapper.body(mockBody);
      fetchWrapper.headers(new Headers()); // Use new Headers() instead of {}
      await fetchWrapper.post();
      expect(
        (fetchWrapper["requestHeaders"] as Record<string, string>)[
          "Content-Type"
        ],
      ).toBe("application/json");
    });

    it("should call the correct request function for POST", async () => {
      fetchWrapper.body(mockBody).headers(mockHeaders);
      const response = await fetchWrapper
        .body(mockBody)
        .headers(mockHeaders)
        .post();
      expect(tsPost).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call the correct request function for GET", async () => {
      const response = await fetchWrapper.params(mockParams).fetch();
      expect(tsFetch).toHaveBeenCalledWith(`${mockUrl}?page=1&limit=10`, {});
      expect(response).toEqual(mockResponse);
    });

    it("should throw error if request function fails", async () => {
      const errorMessage = "Request failed";
      (tsFetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Mock console.error to suppress the log
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(fetchWrapper.fetch()).rejects.toThrow(errorMessage);

      // Ensure console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error with GET request to https://api.example.com/resource:",
        new Error(errorMessage),
      );

      // Clean up mock
      consoleErrorSpy.mockRestore();
    });
  });

  describe("HTTP methods", () => {
    it("should call tsPut for PUT requests", async () => {
      fetchWrapper.body(mockBody).headers(mockHeaders);
      const response = await fetchWrapper.put();
      expect(tsPut).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsPatch for PATCH requests", async () => {
      fetchWrapper.body(mockBody).headers(mockHeaders);
      const response = await fetchWrapper.patch();
      expect(tsPatch).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsDelete for DELETE requests", async () => {
      fetchWrapper.headers(mockHeaders);
      const response = await fetchWrapper.delete();
      expect(tsDelete).toHaveBeenCalledWith(`${mockUrl}`, mockHeaders);
      expect(response).toEqual(mockResponse);
    });
  });
});
