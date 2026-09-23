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
  oneTimePaymentTitle: string | null;
  monthlyPaymentTitle: string | null;
  oneTimeThanksTitle: string | null;
  oneTimeThanksDescription: string | null;
  monthlyThanksTitle: string | null;
  monthlyThanksDescription: string | null;
  registrationThanksTitle: string | null;
  registrationThanksDescription: string | null;
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
        oneTimePaymentTitle: input.oneTimePaymentTitle,
        monthlyPaymentTitle: input.monthlyPaymentTitle,
        oneTimeThanksTitle: input.oneTimeThanksTitle,
        oneTimeThanksDescription: input.oneTimeThanksDescription,
        monthlyThanksTitle: input.monthlyThanksTitle,
        monthlyThanksDescription: input.monthlyThanksDescription,
        registrationThanksTitle: input.registrationThanksTitle,
        registrationThanksDescription: input.registrationThanksDescription,
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
