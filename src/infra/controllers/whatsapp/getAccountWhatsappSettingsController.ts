import type { GetAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/getAccountWhatsappSettingsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetAccountWhatsappSettingsController {
  constructor(private useCase: GetAccountWhatsappSettingsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute(campaignId);
  }
}

export { GetAccountWhatsappSettingsController };
