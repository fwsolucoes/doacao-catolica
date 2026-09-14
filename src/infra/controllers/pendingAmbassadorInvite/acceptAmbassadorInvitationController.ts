import type { AcceptAmbassadorInvitationUseCase } from "~/app/useCases/pendingAmbassadorInvite/acceptAmbassadorInvitationUseCase";
import { redirect } from "react-router";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { acceptAmbassadorInvitationSchema } from "~/infra/schemas/internal/pendingInvite";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class AcceptAmbassadorInvitationController {
  constructor(private useCase: AcceptAmbassadorInvitationUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw redirect("/sign-in");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const input = new SchemaValidatorAdapter(
      acceptAmbassadorInvitationSchema,
    ).validate(body);

    await this.useCase.execute(
      {
        userEmail: user.email,
        projectId: input.projectId,
      },
      user.token,
    );

    const params = new URLSearchParams({
      confirmationInviteParam: "true",
      invitedEmail: user.email,
    });

    return redirect(`/pending-invites?${params.toString()}`);
  }
}

export { AcceptAmbassadorInvitationController };
