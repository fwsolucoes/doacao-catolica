import type { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListContactsController {
  constructor(private listContactsUseCase: ListContactsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.listContactsUseCase.execute(user.token);
  }
}

export { ListContactsController };
