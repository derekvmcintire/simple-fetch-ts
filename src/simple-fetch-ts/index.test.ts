import { simpleTsFetch } from ".";
import { tsFetch } from "../fetch";

jest.mock("../fetch-ts"); // Mock the entire module

describe("simpleTsFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the data from typedFetch", async () => {
    const mockData = { id: 1, name: "Test" };
    (tsFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await simpleTsFetch("/test-url");

    expect(result).toEqual(mockData);
    expect(tsFetch).toHaveBeenCalledWith("/test-url");
  });

  it("should throw an error when typedFetch fails", async () => {
    const errorMessage = "Network error";
    (tsFetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(simpleTsFetch("/test-url")).rejects.toThrow(errorMessage);
  });

  it("should throw an error when typedFetch returns an unexpected result", async () => {
    (tsFetch as jest.Mock).mockResolvedValueOnce({ data: undefined });

    await expect(simpleTsFetch("/test-url")).resolves.toBeUndefined();
    expect(tsFetch).toHaveBeenCalledWith("/test-url");
  });
});
