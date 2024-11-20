import { FetchWrapper } from "../wrapper";
import { isValidURL } from "../utility/helpers";

// Factory function
export const simple = (url: string) => {
  if (!isValidURL(url)) {
    throw new Error(`A valid URL is required, received: ${url}`);
  }

  return new FetchWrapper(url);
};

/*

import { simple } from 'simple-fetch-ts';

// POST Request:
const response = await simple("www.my/url")
    .body({ mydata: "myData" })
    .headers({ Authorization: "Bearer token" })
    .post<MyDataShape>()
    .then((response: FetchTsResponse) => {
      console.log("Success:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return response;


// GET Request:
const response = await simple("www.my/url?limit=100")
    .fetch<MyDataShape>()
    .then((response: FetchTsResponse) => {
      console.log("success: ", response);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });

  return response;

*/
