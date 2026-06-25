import type { ListDonorsUseCase } from "~/app/useCases/donor/listDonorsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListDonorsController {
  constructor(private listDonorsUseCase: ListDonorsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { projectId, accountId } = route.params;
    if (!projectId) throw HttpAdapter.badRequest("projectId is required");
    if (!accountId) throw HttpAdapter.badRequest("accountId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listDonorsUseCase.execute({
      projectId,
      accountId: Number(accountId),
      page,
      search: route.query.search,
      token: user.token,
    });
  }
}

export { ListDonorsController };
