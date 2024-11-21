/**
 * Helper function to retrieve the "Content-Type" header from various possible formats of `HeadersInit`.
 * This function supports the following types for `HeadersInit`:
 * - A `Record<string, string>` object
 * - A `[string, string][]` array of key-value pairs
 * - An instance of the `Headers` class
 * It returns the value of the "Content-Type" header if found, or an empty string if not.
 *
 * @param headers - The `HeadersInit` (either a plain object, array, or Headers instance) to extract the "Content-Type" from.
 * @returns {string} - The value of the "Content-Type" header or an empty string if not found.
 */
export const getContentType = (headers: HeadersInit): string => {
  if (Array.isArray(headers)) {
    // If headers is an array, find the "Content-Type" header
    const contentTypeHeader = headers.find(
      ([key]) => key.toLowerCase() === "content-type",
    );
    return contentTypeHeader ? contentTypeHeader[1] : "";
  } else if (typeof headers === "object" && !(headers instanceof Headers)) {
    // If headers is a plain object, access directly
    return headers["Content-Type"] || "";
  } else if (headers instanceof Headers) {
    // If headers is an instance of Headers, use get() method
    return headers.get("Content-Type") || "";
  }
  return "";
};
