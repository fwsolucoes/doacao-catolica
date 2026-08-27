import { GetShalomMetricsUseCase } from "~/app/useCases/shalomMetrics/getShalomMetricsUseCase";
import { GetShalomMetricsController } from "~/infra/controllers/shalomMetrics/getShalomMetricsController";
import { ShalomMetricsGateway } from "~/infra/gateways/shalomMetrics";

const shalomMetricsGateway = new ShalomMetricsGateway();
const getShalomMetricsUseCase = new GetShalomMetricsUseCase(shalomMetricsGateway);
const getShalomMetricsController = new GetShalomMetricsController(getShalomMetricsUseCase);

const getShalomMetrics = {
  handle: getShalomMetricsController.handle.bind(getShalomMetricsController),
};

export { getShalomMetrics };
