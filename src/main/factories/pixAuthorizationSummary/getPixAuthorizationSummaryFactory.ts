import { GetPixAuthorizationSummaryUseCase } from "~/app/useCases/pixAuthorizationSummary/getPixAuthorizationSummaryUseCase";
import { GetPixAuthorizationSummaryController } from "~/infra/controllers/pixAuthorizationSummary/getPixAuthorizationSummaryController";
import { PixAuthorizationSummaryGateway } from "~/infra/gateways/pixAuthorizationSummary";

const pixAuthorizationSummaryGateway = new PixAuthorizationSummaryGateway();
const getPixAuthorizationSummaryUseCase = new GetPixAuthorizationSummaryUseCase(
  pixAuthorizationSummaryGateway,
);
const getPixAuthorizationSummaryController =
  new GetPixAuthorizationSummaryController(getPixAuthorizationSummaryUseCase);

const getPixAuthorizationSummary = {
  handle: getPixAuthorizationSummaryController.handle.bind(
    getPixAuthorizationSummaryController,
  ),
};

export { getPixAuthorizationSummary };
