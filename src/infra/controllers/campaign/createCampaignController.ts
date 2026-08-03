import type { CreateCampaignUseCase } from "~/app/useCases/campaign/createCampaignUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createCampaignSchema } from "~/infra/schemas/internal/campaign";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateCampaignController {
  constructor(private createCampaignUseCase: CreateCampaignUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    const validated = new SchemaValidatorAdapter(createCampaignSchema).validate(
      body,
    );

    return await this.createCampaignUseCase.execute({
      token: user.token,
      accountId: user.accountId,
      ...validated,
    });
  }
}

export { CreateCampaignController };
