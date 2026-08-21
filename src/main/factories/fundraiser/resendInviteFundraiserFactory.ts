import { ResendInviteFundraiserUseCase } from "~/app/useCases/fundraiser/resendInviteFundraiserUseCase";
import { ResendInviteFundraiserController } from "~/infra/controllers/fundraiser/resendInviteFundraiserController";
import { FundraiserGateway } from "~/infra/gateways/fundraiser";

const fundraiserGateway = new FundraiserGateway();
const resendInviteFundraiserUseCase = new ResendInviteFundraiserUseCase(fundraiserGateway);
const resendInviteFundraiserController = new ResendInviteFundraiserController(
  resendInviteFundraiserUseCase,
);

const resendInviteFundraiser = {
  handle: resendInviteFundraiserController.handle.bind(resendInviteFundraiserController),
};

export { resendInviteFundraiser };
