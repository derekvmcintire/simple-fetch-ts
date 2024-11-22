/**
 * Custom error class for invalid query parameter values.
 * @extends Error
 */
export class InvalidQueryParamError extends Error {
  public key: string;
  public value: unknown;

  /**
   * @param key - The query parameter key.
   * @param value - The invalid value of the query parameter.
   */
  constructor(key: string, value: unknown) {
    super(
      `Invalid query parameter value for key "${key}": "${value}". Only strings, numbers, or arrays of these are allowed.`,
    );
    this.name = "InvalidQueryParamError";
    this.key = key;
    this.value = value;
  }
}

/**
 * Custom error class for invalid query parameter values.
 * @extends Error
 */
export class InvalidQueryParamObjectError extends Error {
  public params: unknown;

  /**
   * @param params - The invalid value of the parameters.
   */
  constructor(params: unknown) {
    super(
      `Invalid argument pased to validateQueryParams: "${params}". Only plain objects allowed.`,
    );
    this.name = "InvalidQueryParamObjectError";
    this.params = params;
  }
}
