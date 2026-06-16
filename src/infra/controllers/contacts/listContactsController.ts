import type { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListContactsController {
  constructor(private listContactsUseCase: ListContactsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const name = route.query.name;

    return await this.listContactsUseCase.execute({ campaignId, name }, user.token);
  }
}

export { ListContactsController };
