import type { UpdateCampaignPreferencesSettingsUseCase } from "~/app/useCases/campaign/updateCampaignPreferencesSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignPreferencesSettingsSchema } from "~/infra/schemas/internal/campaignPreferencesSettings";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignPreferencesSettingsController {
  constructor(
    private updateCampaignPreferencesSettingsUseCase: UpdateCampaignPreferencesSettingsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignPreferencesSettingsSchema,
    ).validate(body);

    return await this.updateCampaignPreferencesSettingsUseCase.execute({
      campaignId,
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignPreferencesSettingsController };
