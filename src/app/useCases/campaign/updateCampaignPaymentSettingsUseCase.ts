import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  pixEnabled: boolean;
  boletoEnabled: boolean;
  creditCardEnabled: boolean;
  minAmount: number | null;
  passFeeToDonor: boolean;
  allowCustomAmount: boolean;
  chargeImmediately: boolean;
};

class UpdateCampaignPaymentSettingsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        pixEnabled: input.pixEnabled,
        boletoEnabled: input.boletoEnabled,
        creditCardEnabled: input.creditCardEnabled,
        minAmount: input.minAmount,
        passFeeToDonor: input.passFeeToDonor,
        allowCustomAmount: input.allowCustomAmount,
        chargeImmediately: input.chargeImmediately,
      },
      input.token,
    );

    return {
      toast: {
        message: "Configurações de pagamento salvas com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignPaymentSettingsUseCase };
