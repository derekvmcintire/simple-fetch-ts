import { SimpleBuilder } from "../../builder";
import { serializeQueryParams } from "../../utility/url-helpers";
import { tsDelete } from "../../methods/delete";
import { tsFetch } from "../../methods/fetch";
import { tsPatch } from "../../methods/patch";
import { tsPost } from "../../methods/post";
import { tsPut } from "../../methods/put";

const mockResponse = {
  data: { message: "response" },
  status: 200,
  headers: new Headers({
    "Content-Type": "application/json",
  }),
  raw: new Response()
};

// Mock AbortController
const mockAbortController = {
  signal: {
    aborted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  abort: jest.fn(),
};

global.AbortController = jest.fn().mockImplementation(() => mockAbortController);

// Mock all HTTP methods with proper parameter handling
jest.mock("../../methods/fetch", () => ({
  tsFetch: jest.fn().mockImplementation((_url, _headers, _signal) => 
    Promise.resolve(mockResponse)
  ),
}));

jest.mock("../../methods/post", () => ({
  tsPost: jest.fn().mockImplementation((_url, _body, _headers, _signal) => 
    Promise.resolve(mockResponse)
  ),
}));

jest.mock("../../methods/put", () => ({
  tsPut: jest.fn().mockImplementation((_url, _body, _headers, _signal) => 
    Promise.resolve(mockResponse)
  ),
}));

jest.mock("../../methods/patch", () => ({
  tsPatch: jest.fn().mockImplementation((_url, _body, _headers, _signal) => 
    Promise.resolve(mockResponse)
  ),
}));

jest.mock("../../methods/delete", () => ({
  tsDelete: jest.fn().mockImplementation((_url, _headers, _signal) => 
    Promise.resolve(mockResponse)
  ),
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
    jest.clearAllMocks();
    simpleBuilder = new SimpleBuilder(mockUrl);
  });

  describe('Initialize and Build', () => {
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
  })

  describe("HTTP methods", () => {
    it("should call the correct request function for POST", async () => {
      const response = await simpleBuilder
        .body<MockBody>(mockBody)
        .headers(mockHeaders)
        .post();

      expect(tsPost).toHaveBeenCalledWith(
        mockUrl,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" },
        mockAbortController.signal
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call the correct request function for GET", async () => {
      const response = await simpleBuilder.params(mockParams).fetch();
      expect(tsFetch).toHaveBeenCalledWith(
        `${mockUrl}?page=1&limit=10`,
        {},
        mockAbortController.signal
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsPut for PUT requests", async () => {
      const response = await simpleBuilder
        .body<MockBody>(mockBody)
        .headers(mockHeaders)
        .put();

      expect(tsPut).toHaveBeenCalledWith(
        mockUrl,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" },
        mockAbortController.signal
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsPatch for PATCH requests", async () => {
      const response = await simpleBuilder
        .body<MockBody>(mockBody)
        .headers(mockHeaders)
        .patch();

      expect(tsPatch).toHaveBeenCalledWith(
        mockUrl,
        mockBody,
        { ...mockHeaders, "Content-Type": "application/json" },
        mockAbortController.signal
      );
      expect(response).toEqual(mockResponse);
    });

    it("should call tsDelete for DELETE requests", async () => {
      const response = await simpleBuilder.headers(mockHeaders).delete();
      expect(tsDelete).toHaveBeenCalledWith(
        mockUrl,
        mockHeaders,
        mockAbortController.signal
      );
      expect(response).toEqual(mockResponse);
    });
  });
});

describe('AbortController functionality', () => {
  let simpleBuilder: SimpleBuilder;
  const mockUrl = "https://api.example.com/resource";
  const customAbortController = new AbortController();

  beforeEach(() => {
    jest.clearAllMocks();
    simpleBuilder = new SimpleBuilder(mockUrl);
  });

  it('should use custom AbortController when provided', async () => {
    const response = await simpleBuilder
      .abortController(customAbortController)
      .fetch();

    expect(tsFetch).toHaveBeenCalledWith(
      mockUrl,
      {},
      customAbortController.signal
    );
  });

  it('should not use AbortController when disabled', async () => {
    simpleBuilder = new SimpleBuilder(mockUrl, {}, false);
    const response = await simpleBuilder.fetch();

    expect(tsFetch).toHaveBeenCalledWith(
      mockUrl,
      {},
      undefined
    );
  });

  it('should propagate abort signal to all HTTP methods', async () => {
    simpleBuilder = simpleBuilder.abortController(customAbortController);

    const mockBody = { data: "test" };
    simpleBuilder.body(mockBody);

    await simpleBuilder.post();
    expect(tsPost).toHaveBeenCalledWith(
      mockUrl,
      mockBody,
      { "Content-Type": "application/json" },
      customAbortController.signal
    );

    await simpleBuilder.put();
    expect(tsPut).toHaveBeenCalledWith(
      mockUrl,
      mockBody,
      { "Content-Type": "application/json" },
      customAbortController.signal
    );
  });

  it('should use new AbortController for each request when enabled', async () => {
    await simpleBuilder.fetch();
    await simpleBuilder.fetch();

    expect(global.AbortController).toHaveBeenCalledTimes(2);
  });
});