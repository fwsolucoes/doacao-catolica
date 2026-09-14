import type { ListPendingAmbassadorInvitesUseCase } from "~/app/useCases/pendingAmbassadorInvite/listPendingAmbassadorInvitesUseCase";
import { redirect } from "react-router";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListPendingAmbassadorInvitesController {
  constructor(private useCase: ListPendingAmbassadorInvitesUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw redirect("/sign-in");

    return await this.useCase.execute(user.email, user.token);
  }
}

export { ListPendingAmbassadorInvitesController };
