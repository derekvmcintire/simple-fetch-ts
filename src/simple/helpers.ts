export type QueryParams = Record<string, string | number | (string | number)[]>;

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
  validateQueryParams(params); // Validate before serializing
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined and null
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
            .map(
              (item) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
            )
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
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
