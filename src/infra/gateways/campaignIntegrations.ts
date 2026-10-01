import type {
  CampaignIntegrations,
  CampaignIntegrationsGatewayDTO,
  UpdateCampaignIntegrationsInput,
} from "~/domain/gateways/campaignIntegrations";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalCampaignIntegrationsSchema } from "../schemas/external/campaignIntegrations";

class CampaignIntegrationsGateway implements CampaignIntegrationsGatewayDTO {
  async getCampaignIntegrations(
    campaignId: string,
    token: string,
  ): Promise<CampaignIntegrations> {
    const url = `/project_preferences/find-one/by-project-id/${campaignId}`;

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalCampaignIntegrationsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);
    const integration = data.projects.project_integration;

    return {
      googleAnalyticsPixel: integration?.google_analytics_pixel ?? null,
      googleTagManagerPixel: integration?.google_tag_manager_pixel ?? null,
      facebookPixel: integration?.facebook_pixel ?? null,
    };
  }

  async updateCampaignIntegrations(
    campaignId: string,
    input: UpdateCampaignIntegrationsInput,
    token: string,
  ): Promise<void> {
    const url = `/update/project-integration/${campaignId}`;

    const body = {
      google_analytics_pixel: input.googleAnalyticsPixel,
      google_tag_manager_pixel: input.googleTagManagerPixel,
      facebook_pixel: input.facebookPixel,
      facebook_enable: input.facebookEnable,
      google_analytics_enable: input.googleAnalyticsEnable,
    };

    const apiResponse = await api.put(url, { body, token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { CampaignIntegrationsGateway };
