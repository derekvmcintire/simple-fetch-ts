#### SimpleTsFetch Example:

```typescript
type ResponseData = { myData: string };
const result = await simpleTsFetch<ResponseData[]>("/api/mydata")
  .then((response: ResponseData[]) => {
    // do something with response
  })
  .catch((error: string) => {
    // do something with error
  });
```

#### Without SimpleTsFetch:

```typescript
try {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Network response status ${response.status} with URL: ${url}`
    );
  }

  const data: T = await response.json();
  return data;
} catch (error: unknown) {
  throw new Error(
    error instanceof Error ? error.message : "An unknown error occurred"
  );
}
```

```typescript
import { simple } from "simple-fetch-ts";

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
```
