import type { UpdateCampaignPaymentSettingsUseCase } from "~/app/useCases/campaign/updateCampaignPaymentSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignPaymentSettingsSchema } from "~/infra/schemas/internal/campaignPaymentSettings";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignPaymentSettingsController {
  constructor(
    private updateCampaignPaymentSettingsUseCase: UpdateCampaignPaymentSettingsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignPaymentSettingsSchema,
    ).validate(body);

    return await this.updateCampaignPaymentSettingsUseCase.execute({
      campaignId,
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignPaymentSettingsController };
