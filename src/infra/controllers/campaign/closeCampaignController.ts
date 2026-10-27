import type { CloseCampaignUseCase } from "~/app/useCases/campaign/closeCampaignUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { closeCampaignSchema } from "~/infra/schemas/internal/campaign";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CloseCampaignController {
  constructor(private closeCampaignUseCase: CloseCampaignUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const { campaignId } = new SchemaValidatorAdapter(
      closeCampaignSchema,
    ).validate(body);

    // encerrar = data final passa a ser hoje
    const endDate = new Date().toISOString();

    return await this.closeCampaignUseCase.execute({
      campaignId,
      token: user.token,
      endDate,
    });
  }
}

export { CloseCampaignController };
