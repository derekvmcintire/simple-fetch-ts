import { SimpleBuilder } from "../builder";
import { isValidURL } from "../utility/url-helpers";

// Factory function
export const simple = (url: string) => {
  if (!isValidURL(url)) {
    throw new Error(`A valid URL is required, received: ${url}`);
  }

  return new SimpleBuilder(url);
};
