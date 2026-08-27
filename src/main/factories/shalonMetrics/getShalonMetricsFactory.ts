import { GetShalonMetricsUseCase } from "~/app/useCases/shalonMetrics/getShalonMetricsUseCase";
import { GetShalonMetricsController } from "~/infra/controllers/shalonMetrics/getShalonMetricsController";
import { ShalonMetricsGateway } from "~/infra/gateways/shalonMetrics";

const shalonMetricsGateway = new ShalonMetricsGateway();
const getShalonMetricsUseCase = new GetShalonMetricsUseCase(shalonMetricsGateway);
const getShalonMetricsController = new GetShalonMetricsController(getShalonMetricsUseCase);

const getShalonMetrics = {
  handle: getShalonMetricsController.handle.bind(getShalonMetricsController),
};

export { getShalonMetrics };
