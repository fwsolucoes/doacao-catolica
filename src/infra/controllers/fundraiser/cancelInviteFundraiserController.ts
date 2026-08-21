import type { CancelInviteFundraiserUseCase } from "~/app/useCases/fundraiser/cancelInviteFundraiserUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { cancelInviteFundraiserSchema } from "~/infra/schemas/internal/fundraiser";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CancelInviteFundraiserController {
  constructor(
    private cancelInviteFundraiserUseCase: CancelInviteFundraiserUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      cancelInviteFundraiserSchema,
    ).validate(body);

    await this.cancelInviteFundraiserUseCase.execute(validated.Id, user.token);

    return {
      toast: {
        message: "Convite cancelado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CancelInviteFundraiserController };
