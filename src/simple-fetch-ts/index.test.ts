import { simpleTsFetch } from ".";
import { typedFetch } from "../fetch-ts";

jest.mock("../fetch-ts"); // Mock the entire module

describe("simpleTsFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the data from typedFetch", async () => {
    const mockData = { id: 1, name: "Test" };
    (typedFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await simpleTsFetch("/test-url");

    expect(result).toEqual(mockData);
    expect(typedFetch).toHaveBeenCalledWith("/test-url");
  });

  it("should throw an error when typedFetch fails", async () => {
    const errorMessage = "Network error";
    (typedFetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(simpleTsFetch("/test-url")).rejects.toThrow(errorMessage);
  });

  it("should throw an error when typedFetch returns an unexpected result", async () => {
    (typedFetch as jest.Mock).mockResolvedValueOnce({ data: undefined });

    await expect(simpleTsFetch("/test-url")).resolves.toBeUndefined();
    expect(typedFetch).toHaveBeenCalledWith("/test-url");
  });
});
