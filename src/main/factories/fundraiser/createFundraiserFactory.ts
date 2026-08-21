import { CreateFundraiserUseCase } from "~/app/useCases/fundraiser/createFundraiserUseCase";
import { CreateFundraiserController } from "~/infra/controllers/fundraiser/createFundraiserController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const createFundraiserUseCase = new CreateFundraiserUseCase(fundraiserGateway);
const createFundraiserController = new CreateFundraiserController(createFundraiserUseCase);

const createFundraiser = {
  handle: createFundraiserController.handle.bind(createFundraiserController),
};

export { createFundraiser };
