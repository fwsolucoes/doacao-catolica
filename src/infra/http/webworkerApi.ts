import { ApiService } from "@arkyn/server";
import { environmentVariables } from "~/main/config/environmentVariables";

const webworkerApi = new ApiService({
  baseUrl: `${environmentVariables.API_URL_WEBWORKER}`,
  enableDebug: process.env.NODE_ENV === "development",
});

export { webworkerApi };
