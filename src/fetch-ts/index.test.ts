import { typedFetch } from ".";

// Mock the fetch API
global.fetch = jest.fn();

describe("typedFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = { id: 1, name: "Test" };
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await typedFetch("/test-url");

    expect(result).toEqual({
      data: mockData,
      status: 200,
      headers: mockResponse.headers,
    });
    expect(fetch).toHaveBeenCalledWith("/test-url");
  });

  it("should throw an error for non-200 responses", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    await expect(typedFetch("/test-url")).rejects.toThrow(
      "Network response status 404 with URL: /test-url",
    );
  });

  it("should handle fetch errors", async () => {
    const errorMessage = "Network error";
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(typedFetch("/test-url")).rejects.toThrow(errorMessage);
  });

  it("should handle unknown errors", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce("Some unknown error");

    await expect(typedFetch("/test-url")).rejects.toThrow(
      "An unknown error occurred",
    );
  });
});
