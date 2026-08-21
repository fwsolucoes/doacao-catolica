import { GetFundraiserDetailsUseCase } from "~/app/useCases/fundraiser/getFundraiserDetailsUseCase";
import { GetFundraiserDetailsController } from "~/infra/controllers/fundraiser/getFundraiserDetailsController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const getFundraiserDetailsUseCase = new GetFundraiserDetailsUseCase(fundraiserGateway);
const getFundraiserDetailsController = new GetFundraiserDetailsController(
  getFundraiserDetailsUseCase,
);

const getFundraiserDetails = {
  handle: getFundraiserDetailsController.handle.bind(getFundraiserDetailsController),
};

export { getFundraiserDetails };
