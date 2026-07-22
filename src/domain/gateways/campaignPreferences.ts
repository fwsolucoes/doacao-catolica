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
  supportWhatsapp: string | null;
  supportEmail: string | null;
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
