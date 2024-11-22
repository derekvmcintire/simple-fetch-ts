import { SimpleBuilder } from "../builder";
import { InvalidURLError } from "../errors/url-validation-error";
import { isValidURL } from "../utility/url-helpers";

// Factory function
export const simple = (url: string) => {
  if (!isValidURL(url)) {
    throw new InvalidURLError(url);
  }

  return new SimpleBuilder(url);
};
