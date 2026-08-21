import type { ResendInviteFundraiserUseCase } from "~/app/useCases/fundraiser/resendInviteFundraiserUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { resendInviteFundraiserSchema } from "~/infra/schemas/internal/fundraiser";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ResendInviteFundraiserController {
  constructor(
    private resendInviteFundraiserUseCase: ResendInviteFundraiserUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      resendInviteFundraiserSchema,
    ).validate(body);

    await this.resendInviteFundraiserUseCase.execute(validated.Id, user.token);

    return {
      toast: {
        message: "Convite reenviado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { ResendInviteFundraiserController };
