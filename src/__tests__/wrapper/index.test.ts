import { SimpleBuilder } from "../../builder";
import { serializeQueryParams } from "../../utility/url-helpers";
import { tsDelete } from "../../methods/delete";
import { tsFetch } from "../../methods/fetch";
import { tsPatch } from "../../methods/patch";
import { tsPost } from "../../methods/post";
import { tsPut } from "../../methods/put";

const mockResponse = {
  data: { message: "response" }, // Mocked data
  status: 200, // Mocked status code
  headers: new Headers({
    "Content-Type": "application/json",
  }),
};

// Mock the helper functions
jest.mock("../../methods/fetch", () => ({
  tsFetch: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../methods/post", () => ({
  tsPost: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../methods/put", () => ({
  tsPut: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../methods/patch", () => ({
  tsPatch: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));
jest.mock("../../methods/delete", () => ({
  tsDelete: jest.fn().mockResolvedValue({
    data: { message: "response" }, // Mocked data
    status: 200, // Mocked status code
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }),
}));

type MockBody = {
  name: string;
};

describe("SimpleBuilder", () => {
  let simpleBuilder: SimpleBuilder;
  const mockUrl = "https://api.example.com/resource";
  const mockHeaders = { Authorization: "Bearer token" };
  const mockParams = { page: 1, limit: 10 };
  const mockBody = { name: "example" };

  beforeEach(() => {
    simpleBuilder = new SimpleBuilder(mockUrl);
  });

  it("should initialize with a URL and optional headers", () => {
    expect(simpleBuilder).toBeInstanceOf(SimpleBuilder);
    expect(simpleBuilder["url"]).toBe(mockUrl);
    expect(simpleBuilder["requestHeaders"]).toEqual({});
  });

  it("should allow method chaining with body, headers, and params", () => {
    simpleBuilder
      .body<MockBody>(mockBody)
      .headers(mockHeaders)
      .params(mockParams);
    expect(simpleBuilder["requestBody"]).toBe(mockBody);
    expect(simpleBuilder["requestHeaders"]).toEqual(mockHeaders);
    expect(simpleBuilder["requestParams"]).toBe(
      serializeQueryParams(mockParams),
    );
  });

  it("should build the correct URL with query parameters", () => {
    simpleBuilder.params(mockParams);
    const builtUrl = simpleBuilder["buildUrl"]();
    expect(builtUrl).toBe(`${mockUrl}?page=1&limit=10`);
  });

  describe("handleRequest", () => {
    it("should throw an error for methods that should not have a body", async () => {
      simpleBuilder.body<MockBody>(mockBody);
      await expect(simpleBuilder.fetch()).rejects.toThrow(
        "GET requests should not have a body.",
      );
    });

    it("should add Content-Type header if not present and body is provided", async () => {
      simpleBuilder.body<MockBody>(mockBody);
      simpleBuilder.headers(new Headers()); // Use new Headers() instead of {}
      await simpleBuilder.post();
      expect(
        (simpleBuilder["requestHeaders"] as Record<string, string>)[
          "Content-Type"
        ],
      ).toBe("application/json");
    });

    it("should call the correct request function for POST", async () => {
      simpleBuilder.body<MockBody>(mockBody).headers(mockHeaders);
      const response = await simpleBuilder
        .body<MockBody>(mockBody)
        .headers(mockHeaders)
        .post();
      expect(tsPost).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody, // Updated to reflect stringified body
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call the correct request function for GET", async () => {
      const response = await simpleBuilder.params(mockParams).fetch();
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

      await expect(simpleBuilder.fetch()).rejects.toThrow(errorMessage);

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
      simpleBuilder.body<MockBody>(mockBody).headers(mockHeaders);
      const response = await simpleBuilder.put();
      expect(tsPut).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody, // Updated to reflect stringified body
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsPatch for PATCH requests", async () => {
      simpleBuilder.body<MockBody>(mockBody).headers(mockHeaders);
      const response = await simpleBuilder.patch();
      expect(tsPatch).toHaveBeenCalledWith(
        `${mockUrl}`,
        mockBody, // Updated to reflect stringified body
        { ...mockHeaders, "Content-Type": "application/json" }, // Content-Type header is automatically added to requests with a body
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsDelete for DELETE requests", async () => {
      simpleBuilder.headers(mockHeaders);
      const response = await simpleBuilder.delete();
      expect(tsDelete).toHaveBeenCalledWith(`${mockUrl}`, mockHeaders);
      expect(response).toEqual(mockResponse);
    });
  });
});
