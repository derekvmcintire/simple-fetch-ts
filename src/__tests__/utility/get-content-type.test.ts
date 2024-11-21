import { getContentType } from "../../utility/get-content-type";

describe("getContentType", () => {
  it('should return the "Content-Type" from a plain object (Record<string, string>)', () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    };

    const result = getContentType(headers);

    expect(result).toBe("application/json");
  });

  it('should return an empty string if "Content-Type" is not in the plain object', () => {
    const headers: Record<string, string> = {
      Authorization: "Bearer token",
    };

    const result = getContentType(headers);

    expect(result).toBe("");
  });

  it('should return the "Content-Type" from a [string, string][] array', () => {
    const headers: [string, string][] = [
      ["Content-Type", "application/json"],
      ["Authorization", "Bearer token"],
    ];

    const result = getContentType(headers);

    expect(result).toBe("application/json");
  });

  it('should return an empty string if "Content-Type" is not in the [string, string][] array', () => {
    const headers: [string, string][] = [["Authorization", "Bearer token"]];

    const result = getContentType(headers);

    expect(result).toBe("");
  });

  it('should return the "Content-Type" from an instance of Headers', () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer token");

    const result = getContentType(headers);

    expect(result).toBe("application/json");
  });

  it('should return an empty string if "Content-Type" is not in the Headers instance', () => {
    const headers = new Headers();
    headers.append("Authorization", "Bearer token");

    const result = getContentType(headers);

    expect(result).toBe("");
  });

  it('should return an empty string if the "Content-Type" header is empty or not present in the headers array', () => {
    const headers: [string, string][] = [["Content-Type", ""]];

    const result = getContentType(headers);

    expect(result).toBe("");
  });
});
