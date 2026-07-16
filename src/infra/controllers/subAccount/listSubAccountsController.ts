import type { ListSubAccountsUseCase } from "~/app/useCases/subAccount/listSubAccountsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListSubAccountsController {
  constructor(private listSubAccountsUseCase: ListSubAccountsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);

    if (!user) throw HttpAdapter.unauthorized("Unauthorized");
    if (!user.accountId) throw HttpAdapter.badRequest("account_id is required");

    return await this.listSubAccountsUseCase.execute(
      {
        accountId: user.accountId,
      },
      user.token,
    );
  }
}

export { ListSubAccountsController };
