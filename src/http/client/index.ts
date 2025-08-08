import axios from "axios";
import { handleTokenExpiration } from "../../utils/authExpiration";


export function httpClient(config: any) {
  const params = {
    baseURL: config.request.url,
    timeout: config.request.timeout ?? 30000,
    method: config.request.method ?? "GET",
    headers: {},
    signal: config.signal?.signal,
  };

  const externalClient = axios.create(params);
  const token = config.request.token;
  const headers = config.request.headers || {};
  externalClient.interceptors.request.use(async (config) => {
    if (config.headers) {
      config.headers["Authorization"] = token ? `Bearer ${token}` : "";
      Object.keys(headers).forEach((key) => {
        config.headers[key] = headers[key];
      });
    }
    return config;
  });

  externalClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.statuscode === 401) {
        handleTokenExpiration();
      }
      return Promise.reject(error);
    }
  );

  return externalClient;
}
