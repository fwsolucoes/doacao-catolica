import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  redirectAfterRegistration: string | null;
  redirectAfterOneTimePayment: string | null;
  redirectAfterRecurringPayment: string | null;
  nomenclature: string | null;
  supportTagId: string | null;
  showAutoPixInvite: boolean;
  requireLogin: boolean;
};

class UpdateCampaignPreferencesSettingsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        redirectAfterRegistration: input.redirectAfterRegistration,
        redirectAfterOneTimePayment: input.redirectAfterOneTimePayment,
        redirectAfterRecurringPayment: input.redirectAfterRecurringPayment,
        nomenclature: input.nomenclature,
        supportTagId: input.supportTagId,
        showAutoPixInvite: input.showAutoPixInvite,
        requireLogin: input.requireLogin,
      },
      input.token,
    );

    return {
      toast: {
        message: "Preferências salvas com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignPreferencesSettingsUseCase };
