import { GetPixAuthorizationHistoryUseCase } from "~/app/useCases/pixAuthorizationHistory/getPixAuthorizationHistoryUseCase";
import { GetPixAuthorizationHistoryController } from "~/infra/controllers/pixAuthorizationHistory/getPixAuthorizationHistoryController";
import { PixAuthorizationHistoryGateway } from "~/infra/gateways/pixAuthorizationHistory";

const pixAuthorizationHistoryGateway = new PixAuthorizationHistoryGateway();
const getPixAuthorizationHistoryUseCase = new GetPixAuthorizationHistoryUseCase(
  pixAuthorizationHistoryGateway,
);
const getPixAuthorizationHistoryController =
  new GetPixAuthorizationHistoryController(getPixAuthorizationHistoryUseCase);

const getPixAuthorizationHistory = {
  handle: getPixAuthorizationHistoryController.handle.bind(
    getPixAuthorizationHistoryController,
  ),
};

export { getPixAuthorizationHistory };
