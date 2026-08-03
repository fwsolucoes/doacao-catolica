import type { ListProjectCategoriesUseCase } from "~/app/useCases/projectCategory/listProjectCategoriesUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListProjectCategoriesController {
  constructor(private listProjectCategoriesUseCase: ListProjectCategoriesUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.listProjectCategoriesUseCase.execute(user.token);
  }
}

export { ListProjectCategoriesController };
