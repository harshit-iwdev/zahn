import { apiUrl } from "../../config/config";
import { httpClient } from "../client";


export function executor(method: string, endpoint: string) {
  const persistedData = localStorage.getItem("access_token");
  return new (function () {
    const abortController = new AbortController();
    this.execute = async function (params: any) {
      const config = {
        request: {
          url: apiUrl,
          token: persistedData,
        },
        signal: abortController.signal,
      };
      const client = httpClient(config);
      const response = await client[method](endpoint, params);
      return response;
    };

    this.cancel = function () {
      abortController.abort();
    };
  })();
}
