type CampaignIntegrations = {
  googleAnalyticsPixel: string | null;
  googleTagManagerPixel: string | null;
  facebookPixel: string | null;
};

type UpdateCampaignIntegrationsInput = {
  googleAnalyticsPixel: string | null;
  googleTagManagerPixel: string | null;
  facebookPixel: string | null;
  facebookEnable: boolean;
  googleAnalyticsEnable: boolean;
};

type CampaignIntegrationsGatewayDTO = {
  getCampaignIntegrations(
    campaignId: string,
    token: string,
  ): Promise<CampaignIntegrations>;
  updateCampaignIntegrations(
    campaignId: string,
    input: UpdateCampaignIntegrationsInput,
    token: string,
  ): Promise<void>;
};

export type {
  CampaignIntegrations,
  CampaignIntegrationsGatewayDTO,
  UpdateCampaignIntegrationsInput,
};
