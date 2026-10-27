import type { UpdateCampaignStatusUseCase } from "~/app/useCases/campaign/updateCampaignStatusUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignStatusSchema } from "~/infra/schemas/internal/campaign";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignStatusController {
  constructor(private updateCampaignStatusUseCase: UpdateCampaignStatusUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignStatusSchema,
    ).validate(body);

    return await this.updateCampaignStatusUseCase.execute({
      token: user.token,
      ...validated,
    });
  }
}

export { UpdateCampaignStatusController };
