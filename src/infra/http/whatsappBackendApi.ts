import { ApiService } from "@arkyn/server";
import { environmentVariables } from "~/main/config/environmentVariables";

const whatsappBackendApi = new ApiService({
  baseUrl: environmentVariables.BACKEND_ATENDIMENTO_URL,
  enableDebug: process.env.NODE_ENV === "development",
});

export { whatsappBackendApi };
