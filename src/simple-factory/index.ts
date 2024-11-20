import { FetchWrapper } from "../wrapper";
import { isValidURL } from "../utility/helpers";

// Factory function
export const simple = (url: string) => {
  if (!isValidURL(url)) {
    throw new Error(`A valid URL is required, received: ${url}`);
  }

  return new FetchWrapper(url);
};
