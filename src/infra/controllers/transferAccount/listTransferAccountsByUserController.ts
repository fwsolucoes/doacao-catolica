import type { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListTransferAccountsByUserController {
  constructor(private useCase: ListTransferAccountsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return this.useCase.execute({ accountId: user.accountId }, user.token);
  }
}

export { ListTransferAccountsByUserController };
