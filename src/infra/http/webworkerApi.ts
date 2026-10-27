import { ApiService } from "@arkyn/server";
import { environmentVariables } from "~/main/config/environmentVariables";
import { REQUEST_TIMEOUT_MS } from "./requestTimeout";

const webworkerApi = new ApiService({
  baseUrl: `${environmentVariables.API_URL_WEBWORKER}`,
  enableDebug: process.env.NODE_ENV === "development",
  timeoutMs: REQUEST_TIMEOUT_MS,
});

export { webworkerApi };
