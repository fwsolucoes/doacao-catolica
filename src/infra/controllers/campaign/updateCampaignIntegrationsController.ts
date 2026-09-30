import type { UpdateCampaignIntegrationsUseCase } from "~/app/useCases/campaign/updateCampaignIntegrationsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignIntegrationsSettingsSchema } from "~/infra/schemas/internal/campaignIntegrationsSettings";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignIntegrationsController {
  constructor(
    private updateCampaignIntegrationsUseCase: UpdateCampaignIntegrationsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignIntegrationsSettingsSchema,
    ).validate(body);

    return await this.updateCampaignIntegrationsUseCase.execute({
      campaignId,
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignIntegrationsController };
