import type { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListTransferAccountsController {
  constructor(
    private listTransferAccountsUseCase: ListTransferAccountsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    console.log(user?.accountId);

    if (!user) throw HttpAdapter.unauthorized("Unauthorized");
    if (!user.accountId) throw HttpAdapter.badRequest("account_id is required");

    return await this.listTransferAccountsUseCase.execute(
      { accountId: user.accountId },
      user.token,
    );
  }
}

export { ListTransferAccountsController };
