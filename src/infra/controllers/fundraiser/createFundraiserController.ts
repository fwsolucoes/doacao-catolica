import type { CreateFundraiserUseCase } from "~/app/useCases/fundraiser/createFundraiserUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createFundraiserSchema } from "~/infra/schemas/internal/fundraiser";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

function generateCode(): string {
  return crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase();
}

class CreateFundraiserController {
  constructor(private createFundraiserUseCase: CreateFundraiserUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const inviterId = user.accountId;

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createFundraiserSchema).validate(body);

    await this.createFundraiserUseCase.execute(
      {
        projectId: campaignId,
        inviterId,
        invitedUserEmail: validated.invitedUserEmail,
        invitedUserName: validated.invitedUserName,
        percentageCommission: validated.percentageCommission,
        token: generateCode(),
      },
      user.token,
    );

    return {
      toast: {
        message: "Convite enviado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateFundraiserController };
