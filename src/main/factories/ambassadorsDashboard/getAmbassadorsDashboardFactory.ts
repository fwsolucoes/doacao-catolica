import { GetAmbassadorsDashboardUseCase } from "~/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase";
import { GetAmbassadorsDashboardController } from "~/infra/controllers/ambassadorsDashboard/getAmbassadorsDashboardController";
import { AmbassadorsDashboardGateway } from "~/infra/gateways/ambassadorsDashboard";

const gateway = new AmbassadorsDashboardGateway();
const useCase = new GetAmbassadorsDashboardUseCase(gateway);
const controller = new GetAmbassadorsDashboardController(useCase);

const getAmbassadorsDashboard = {
  handle: controller.handle.bind(controller),
};

export { getAmbassadorsDashboard };
