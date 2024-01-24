import axios, { AxiosResponseHeaders } from "axios";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

const host = process.env.HOST;

export async function getApi(request: LoaderFunctionArgs["request"]) {
  const instance = axios.create({
    baseURL: "/api",
  });

  instance.interceptors.request.use(async (config) => {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("id_token");
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
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
}

function checkHeadersForReauthorization(headers: AxiosResponseHeaders) {
  const authUrlHeader =
    (headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url") as string) ||
    `/api/auth`;

  return redirect(
    authUrlHeader.startsWith("/")
      ? `https://${host}${authUrlHeader}`
      : authUrlHeader
  );
}
