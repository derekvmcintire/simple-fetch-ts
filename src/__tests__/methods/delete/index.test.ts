import { tsDelete } from "../../../methods/delete";

// Mocking the global fetch function
global.fetch = jest.fn();

describe("tsDelete", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully make a DELETE request and return the expected data", async () => {
    // Setup the mock response
    const mockData = { success: true };
    const mockHeaders = new Headers();
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: mockHeaders,
    });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "https://example.com/delete";
    const headers = { Authorization: "Bearer token" };

    const result = await tsDelete(url, headers);

    expect(fetch).toHaveBeenCalledWith(url, {
      method: "DELETE",
      headers: headers,
    });
    expect(result.data).toEqual(mockData);
    expect(result.status).toBe(200);
    expect(result.headers).toBeInstanceOf(Headers); // Check if the headers is an instance of Headers
  });

  it("should throw an error when the response status is not OK", async () => {
    // Setup a mock response with an error status
    const mockResponse = new Response(null, { status: 404 });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = "https://example.com/delete";
    const headers = {};

    await expect(tsDelete(url, headers)).rejects.toThrow(
      "DELETE request to https://example.com/delete failed with status 404: No status text",
    );
  });

  it("should throw an error if fetch fails", async () => {
    // Simulate a fetch failure
    const errorMessage = "Fetch failed";
    (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const url = "https://example.com/delete";
    const headers = {};

    await expect(tsDelete(url, headers)).rejects.toThrow(errorMessage);
  });

  it("should throw an error if the error is not an instance of Error", async () => {
    // Simulate a fetch failure where the error is not an instance of Error
    (global.fetch as jest.Mock).mockRejectedValue("Non-error");

    const url = "https://example.com/delete";
    const headers = {};

    await expect(tsDelete(url, headers)).rejects.toThrow(
      "An unknown error occurred",
    );
  });
});
