import { QueryParams } from "..";

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

export const serializeQueryParams = (params: QueryParams): string => {
  validateQueryParams(params); // Ensure all parameters are valid

  // Serialize the valid parameters into the query string
  return Object.entries(params)
    .map(([key, value]) => {
      // Check if the value is valid (not null or undefined)
      if (value === null || value === undefined) {
        throw new Error(
          `Invalid query parameter value for key "${key}": null or undefined is not allowed.`,
        );
      }

      // Handle array values as repeated key-value pairs
      if (Array.isArray(value)) {
        return value
          .map(
            (item) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
          )
          .join("&");
      }

      // Handle regular string/number values
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url); // Will throw if the URL is invalid
    return true;
  } catch {
    return false;
  }
};
