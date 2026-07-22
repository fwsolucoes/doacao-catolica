import type {
  CampaignPreferences,
  CampaignPreferencesGatewayDTO,
  UpdateCampaignPreferencesInput,
} from "~/domain/gateways/campaignPreferences";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalCampaignPreferencesSchema } from "../schemas/external/campaignPreferences";

class CampaignPreferencesGateway implements CampaignPreferencesGatewayDTO {
  async getCampaignPreferences(
    campaignId: string,
    token: string,
  ): Promise<CampaignPreferences> {
    const apiResponse = await api.get(
      `/project_preferences/find-one/by-project-id/${campaignId}`,
      { token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalCampaignPreferencesSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return {
      id: data.id,
      title: data.registration_title,
      description: data.registration_text,
      whyDonateTitle: data.why_donate_title,
      whyDonateText: data.why_donate_text,
      whyDonateImage: data.why_donate_image,
      aboutUsTitle: data.about_us_title,
      aboutUsText: data.about_us_text,
      aboutUsImage: data.about_us_image,
      supportWhatsapp: data.support_whatsapp,
      supportEmail: data.support_email,
    };
  }

  async updateCampaignPreferences(
    preferencesId: string,
    input: UpdateCampaignPreferencesInput,
    token: string,
  ): Promise<void> {
    const body = {
      // Fields below will be sent once the API supports them:
      registration_title: input.title,
      // why_donate_title: input.whyDonateTitle,
      // why_donate_text: input.whyDonateText,
      // why_donate_image: input.whyDonateImage,
      // about_us_title: input.aboutUsTitle,
      // about_us_text: input.aboutUsText,
      // about_us_image: input.aboutUsImage,
      // support_whatsapp: input.supportWhatsapp,
      // support_email: input.supportEmail,
    };

    const apiResponse = await api.put(
      `/project_preferences/update/${preferencesId}`,
      { body, token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { CampaignPreferencesGateway };
