import type { ResendInviteCollaboratorUseCase } from "~/app/useCases/inviteCollaborator/resendInviteCollaboratorUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { resendInviteCollaboratorSchema } from "~/infra/schemas/internal/inviteCollaborator";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ResendInviteCollaboratorController {
  constructor(
    private resendInviteCollaboratorUseCase: ResendInviteCollaboratorUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      resendInviteCollaboratorSchema,
    ).validate(body);

    await this.resendInviteCollaboratorUseCase.execute(validated.Id, user.token);

    return {
      toast: {
        message: "Convite reenviado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { ResendInviteCollaboratorController };
