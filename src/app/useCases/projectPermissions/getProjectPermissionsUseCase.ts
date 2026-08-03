import type {
  CampaignGatewayDTO,
  GetProjectPermissionsOutput,
} from "~/domain/gateways/campaign";

type InputProps = {
  projectId: string;
  userId: string;
  token: string;
};

class GetProjectPermissionsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps): Promise<GetProjectPermissionsOutput> {
    const { projectId, userId, token } = input;
    return this.campaignGateway.getProjectPermissions(projectId, userId, token);
  }
}

export { GetProjectPermissionsUseCase };
