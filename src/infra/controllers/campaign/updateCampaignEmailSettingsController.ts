import type { UpdateCampaignEmailSettingsUseCase } from "~/app/useCases/campaign/updateCampaignEmailSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignEmailSettingsSchema } from "~/infra/schemas/internal/campaignEmailSettings";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignEmailSettingsController {
  constructor(
    private updateCampaignEmailSettingsUseCase: UpdateCampaignEmailSettingsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignEmailSettingsSchema,
    ).validate(body);

    return await this.updateCampaignEmailSettingsUseCase.execute({
      campaignId,
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignEmailSettingsController };
