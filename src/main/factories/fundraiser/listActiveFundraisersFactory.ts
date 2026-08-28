import { ListActiveFundraisersUseCase } from "~/app/useCases/fundraiser/listActiveFundraisersUseCase";
import { ListActiveFundraisersController } from "~/infra/controllers/fundraiser/listActiveFundraisersController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const gateway = new FundraiserGateway();
const useCase = new ListActiveFundraisersUseCase(gateway);
const listActiveFundraisers = new ListActiveFundraisersController(useCase);

export { listActiveFundraisers };
