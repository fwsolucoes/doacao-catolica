import { ListFundraisersUseCase } from "~/app/useCases/fundraiser/listFundraisersUseCase";
import { ListFundraisersController } from "~/infra/controllers/fundraiser/listFundraisersController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const listFundraisersUseCase = new ListFundraisersUseCase(fundraiserGateway);
const listFundraisersController = new ListFundraisersController(listFundraisersUseCase);

const listFundraisers = {
  handle: listFundraisersController.handle.bind(listFundraisersController),
};

export { listFundraisers };
