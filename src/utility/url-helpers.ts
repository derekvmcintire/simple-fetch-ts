import { QueryParams } from "..";

/**
 * Validates the query parameters to ensure they are a plain object and that each parameter
 * has a value that is either a string, a number, or an array of strings/numbers.
 * Throws an error if the parameters don't meet these conditions.
 *
 * @param params - The query parameters to validate.
 * @throws {Error} - If the parameters are not a plain object or contain invalid values.
 */
export const validateQueryParams = (params: unknown): void => {
  if (typeof params !== "object" || params === null || Array.isArray(params)) {
    throw new Error("Query parameters must be a plain object.");
  }

  for (const [key, value] of Object.entries(params)) {
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      !(
        Array.isArray(value) &&
        value.every(
          (item) => typeof item === "string" || typeof item === "number",
        )
      )
    ) {
      throw new Error(
        `Invalid query parameter value for key "${key}": Only strings, numbers, or arrays of these are allowed.`,
      );
    }
  }
};

/**
 * Serializes a given object of query parameters into a URL query string.
 * This function ensures that the parameters are valid using `validateQueryParams` before serializing.
 *
 * @param params - The query parameters to serialize, which should be a valid `QueryParams` object.
 * @param lowerCaseKeys - Optional flag to convert query parameter keys to lowercase.
 * @returns {string} - The serialized query string.
 * @throws {Error} - If any parameter is invalid or has a null/undefined value.
 */
export const serializeQueryParams = (
  params: QueryParams,
  lowerCaseKeys: boolean = false,
): string => {
  validateQueryParams(params); // Ensure all parameters are valid

  // Serialize the valid parameters into the query string
  return Object.entries(params)
    .map(([key, value]) => {
      const finalKey = lowerCaseKeys ? key.toLowerCase() : key;

      // Check if the value is valid (not null or undefined)
      if (value === null || value === undefined) {
        throw new Error(
          `Invalid query parameter value for key "${finalKey}": null or undefined is not allowed.`,
        );
      }

      // Handle array values as repeated key-value pairs
      if (Array.isArray(value)) {
        return value
          .map(
            (item) =>
              `${encodeURIComponent(finalKey)}=${encodeURIComponent(String(item))}`,
          )
          .join("&");
      }

      // Handle regular string/number values
      return `${encodeURIComponent(finalKey)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
};

/**
 * Checks whether a given string is a valid URL.
 * This function attempts to create a new URL object using the provided string.
 * If the URL is invalid, it returns `false`; otherwise, it returns `true`.
 *
 * @param url - The URL string to check.
 * @returns {boolean} - `true` if the URL is valid, `false` otherwise.
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url); // Will throw if the URL is invalid
    return true;
  } catch {
    return false;
  }
};
