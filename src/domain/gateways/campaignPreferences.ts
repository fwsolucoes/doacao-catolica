type CampaignPreferences = {
  id: string;
  // Fields below will be populated once the API supports them:
  title: string | null;
  description: string | null;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutUsTitle: string | null;
  aboutUsText: string | null;
  aboutUsImage: string | null;
  whyDonateEnabled: boolean | null;
  aboutUsEnabled: boolean | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
  pixEnabled: boolean | null;
  boletoEnabled: boolean | null;
  creditCardEnabled: boolean | null;
  minAmount: number | null;
  passFeeToDonor: boolean | null;
  allowCustomAmount: boolean | null;
  chargeImmediately: boolean | null;
  emailSenderName: string | null;
  emailReplyTo: string | null;
};

type UpdateCampaignPreferencesInput = {
  title: string | null;
  description: string | null;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutUsTitle: string | null;
  aboutUsText: string | null;
  aboutUsImage: string | null;
  whyDonateEnabled: boolean | null;
  aboutUsEnabled: boolean | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
};

type CampaignPreferencesGatewayDTO = {
  getCampaignPreferences: (
    campaignId: string,
    token: string,
  ) => Promise<CampaignPreferences>;
  updateCampaignPreferences: (
    preferencesId: string,
    input: UpdateCampaignPreferencesInput,
    token: string,
  ) => Promise<void>;
};

export type {
  CampaignPreferences,
  CampaignPreferencesGatewayDTO,
  UpdateCampaignPreferencesInput,
};
