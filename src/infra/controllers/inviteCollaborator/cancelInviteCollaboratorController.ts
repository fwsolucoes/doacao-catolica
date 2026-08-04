import type { CancelInviteCollaboratorUseCase } from "~/app/useCases/inviteCollaborator/cancelInviteCollaboratorUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { cancelInviteCollaboratorSchema } from "~/infra/schemas/internal/inviteCollaborator";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CancelInviteCollaboratorController {
  constructor(
    private cancelInviteCollaboratorUseCase: CancelInviteCollaboratorUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      cancelInviteCollaboratorSchema,
    ).validate(body);

    await this.cancelInviteCollaboratorUseCase.execute(validated.Id, user.token);

    return {
      toast: {
        message: "Convite cancelado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CancelInviteCollaboratorController };
