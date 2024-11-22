import { simple } from "../../simple-factory";
import { isValidURL } from "../../utility/url-helpers";
import { SimpleBuilder } from "../../builder";

// Mock the isValidURL function
jest.mock("../../utility/url-helpers", () => ({
  isValidURL: jest.fn(),
}));

describe("simple factory function", () => {
  it("should return a new SimpleBuilder instance for a valid URL", () => {
    const validUrl = "https://api.example.com";

    // Mock isValidURL to return true for valid URL
    (isValidURL as jest.Mock).mockReturnValue(true);

    const wrapper = simple(validUrl);

    // Ensure a SimpleBuilder instance is returned
    expect(wrapper).toBeInstanceOf(SimpleBuilder);
    expect(wrapper["url"]).toBe(validUrl); // Ensure the correct URL is passed
  });

  it("should throw an error for an invalid URL", () => {
    const invalidUrl = "invalid-url";

    // Mock isValidURL to return false for invalid URL
    (isValidURL as jest.Mock).mockReturnValue(false);

    // Expect an error to be thrown with the correct message
    expect(() => simple(invalidUrl)).toThrow(
      `A valid URL is required, received: ${invalidUrl}`,
    );
  });

  it("should call isValidURL with the provided URL", () => {
    const validUrl = "https://api.example.com";

    // Mock isValidURL to return true for valid URL
    (isValidURL as jest.Mock).mockReturnValue(true);

    // Call the simple function
    simple(validUrl);

    // Ensure isValidURL was called with the correct URL
    expect(isValidURL).toHaveBeenCalledWith(validUrl);
  });
});
