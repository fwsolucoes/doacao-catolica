import type { GetProjectPermissionsUseCase } from "~/app/useCases/projectPermissions/getProjectPermissionsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetProjectPermissionsController {
  constructor(private useCase: GetProjectPermissionsUseCase) {}

  async handle(route: RouteDTO, projectId: string) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return this.useCase.execute({
      projectId,
      userId: user.id,
      token: user.token,
    });
  }
}

export { GetProjectPermissionsController };
