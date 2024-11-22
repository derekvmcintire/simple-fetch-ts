import { tsPost } from "../../../methods/post";
import { SimpleResponse } from "../../../types";

// Mocking the global fetch function
global.fetch = jest.fn();

describe("tsPost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully make a POST request and return the expected data", async () => {
    // Mock response data and headers
    const mockData = { success: true };
    const mockHeaders = new Headers();
    mockHeaders.append("Authorization", "Bearer token"); // Add a custom header
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: mockHeaders,
    });

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "https://example.com/post";
    const requestBody = { name: "John Doe" };
    const requestHeaders = { Authorization: "Bearer token" };

    const result: SimpleResponse<typeof mockData> = await tsPost(
      url,
      requestBody,
      requestHeaders,
    );

    // Check that the correct fetch call was made
    expect(fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      body: requestBody,
      headers: {
        Authorization: "Bearer token",
      },
    });

    // Check the result
    expect(result.data).toEqual(mockData);
    expect(result.status).toBe(200);
    expect(result.headers.has("Authorization")).toBe(true);
    expect(result.headers.get("Authorization")).toBe("Bearer token");
  });

  it("should throw an error when the response status is not OK (e.g., 400)", async () => {
    // Mock a non-OK response (e.g., status 400)
    const mockResponse = new Response(null, { status: 400 });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "https://example.com/post";
    const requestBody = { name: "John Doe" };
    const requestHeaders = {};

    await expect(tsPost(url, requestBody, requestHeaders)).rejects.toThrow(
      "Network response status 400 with URL: https://example.com/post",
    );
  });

  it("should throw an error when the fetch fails (e.g., network error)", async () => {
    // Simulate a fetch failure (e.g., network error)
    const errorMessage = "Network failure";
    (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const url = "https://example.com/post";
    const requestBody = { name: "John Doe" };
    const requestHeaders = {};

    await expect(tsPost(url, requestBody, requestHeaders)).rejects.toThrow(
      errorMessage,
    );
  });

  it("should throw an error when an unexpected error type is thrown", async () => {
    // Simulate an unexpected error type
    (global.fetch as jest.Mock).mockRejectedValue("Non-error");

    const url = "https://example.com/post";
    const requestBody = { name: "John Doe" };
    const requestHeaders = {};

    await expect(tsPost(url, requestBody, requestHeaders)).rejects.toThrow(
      "An unknown error occurred",
    );
  });
});
