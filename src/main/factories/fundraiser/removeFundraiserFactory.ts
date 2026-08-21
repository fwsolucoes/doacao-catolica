import { RemoveFundraiserUseCase } from "~/app/useCases/fundraiser/removeFundraiserUseCase";
import { RemoveFundraiserController } from "~/infra/controllers/fundraiser/removeFundraiserController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const removeFundraiserUseCase = new RemoveFundraiserUseCase(fundraiserGateway);
const removeFundraiserController = new RemoveFundraiserController(removeFundraiserUseCase);

const removeFundraiser = {
  handle: removeFundraiserController.handle.bind(removeFundraiserController),
};

export { removeFundraiser };
