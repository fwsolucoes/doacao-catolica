import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  emailSenderName: string | null;
  emailReplyTo: string | null;
};

class UpdateCampaignEmailSettingsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        emailSenderName: input.emailSenderName,
        emailReplyTo: input.emailReplyTo,
      },
      input.token,
    );

    return {
      toast: {
        message: "Configurações de e-mail salvas com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignEmailSettingsUseCase };
