import { CancelInviteFundraiserUseCase } from "~/app/useCases/fundraiser/cancelInviteFundraiserUseCase";
import { CancelInviteFundraiserController } from "~/infra/controllers/fundraiser/cancelInviteFundraiserController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const cancelInviteFundraiserUseCase = new CancelInviteFundraiserUseCase(fundraiserGateway);
const cancelInviteFundraiserController = new CancelInviteFundraiserController(
  cancelInviteFundraiserUseCase,
);

const cancelInviteFundraiser = {
  handle: cancelInviteFundraiserController.handle.bind(cancelInviteFundraiserController),
};

export { cancelInviteFundraiser };
