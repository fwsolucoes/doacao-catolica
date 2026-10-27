import { ApiService } from "@arkyn/server";
import { environmentVariables } from "~/main/config/environmentVariables";
import { REQUEST_TIMEOUT_MS } from "./requestTimeout";

const api = new ApiService({
  baseUrl: `${environmentVariables.API_URL}`,
  enableDebug: process.env.NODE_ENV === "development",
  timeoutMs: REQUEST_TIMEOUT_MS,
});

export { api };
