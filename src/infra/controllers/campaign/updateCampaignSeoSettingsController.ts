import type { UpdateCampaignSeoSettingsUseCase } from "~/app/useCases/campaign/updateCampaignSeoSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignSeoSettingsSchema } from "~/infra/schemas/internal/campaignSeoSettings";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignSeoSettingsController {
  constructor(
    private updateCampaignSeoSettingsUseCase: UpdateCampaignSeoSettingsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignSeoSettingsSchema,
    ).validate(body);

    return await this.updateCampaignSeoSettingsUseCase.execute({
      campaignId,
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignSeoSettingsController };
