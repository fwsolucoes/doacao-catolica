import { GetProjectPermissionsUseCase } from "~/app/useCases/projectPermissions/getProjectPermissionsUseCase";
import { GetProjectPermissionsController } from "~/infra/controllers/projectPermissions/getProjectPermissionsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getProjectPermissionsUseCase = new GetProjectPermissionsUseCase(
  campaignGateway,
);
const getProjectPermissionsController = new GetProjectPermissionsController(
  getProjectPermissionsUseCase,
);

const getProjectPermissions = {
  handle: getProjectPermissionsController.handle.bind(
    getProjectPermissionsController,
  ),
};

export { getProjectPermissions };
