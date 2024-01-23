import axios, { AxiosResponseHeaders } from "axios";
import { useMemo } from "react";

export function useApi() {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "/api",
    });

    // To check if the token is set or wait the request until it's set
    instance.interceptors.request.use(async (config) => {
      const token = await shopify.idToken();

      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["X-Requested-With"] = "XMLHttpRequest";

      return config;
    });

    instance.interceptors.response.use(
      (response) => {
        checkHeadersForReauthorization(
          response.headers as AxiosResponseHeaders
        );
        return response;
      },
      (error) => {
        if (error.response.headers) {
          checkHeadersForReauthorization(error.response.headers);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return { api };
}

function checkHeadersForReauthorization(headers: AxiosResponseHeaders) {
  if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
    const authUrlHeader =
      (headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      ) as string) || `/api/auth`;

    window.open(
      authUrlHeader.startsWith("/")
        ? `https://${window.location.host}${authUrlHeader}`
        : authUrlHeader,
      "_self"
    );
  }
}
