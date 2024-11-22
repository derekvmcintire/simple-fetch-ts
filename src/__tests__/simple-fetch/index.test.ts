import { tsFetch } from "../../methods/fetch";
import { simpleFetch } from "../../simple-fetch";

jest.mock("../../methods/fetch"); // Mock the entire module

describe("simpleTsFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the data from typedFetch", async () => {
    const mockData = { id: 1, name: "Test" };
    (tsFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await simpleFetch("/test-url", {
      Authorization: "Bearer Token",
    });

    expect(result).toEqual(mockData);
    expect(tsFetch).toHaveBeenCalledWith("/test-url", {
      Authorization: "Bearer Token",
    });
  });

  it("should throw an error when typedFetch fails", async () => {
    const errorMessage = "Network error";
    (tsFetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(simpleFetch("/test-url")).rejects.toThrow(errorMessage);
  });

  it("should throw an error when typedFetch returns an unexpected result", async () => {
    (tsFetch as jest.Mock).mockResolvedValueOnce({ data: undefined });

    // We expect an error to be thrown since the fetch response contains no data
    await expect(simpleFetch("/test-url")).rejects.toThrow(
      "No data returned from the fetch for URL: /test-url",
    );
  });
});