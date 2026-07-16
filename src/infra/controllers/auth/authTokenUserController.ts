import type { AuthTokenUserUseCase } from "~/app/useCases/user/authTokenUserUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";
import type { User } from "~/main/types/user";

class AuthTokenUserController {
  constructor(private authTokenUserUseCase: AuthTokenUserUseCase) {}

  async handle(route: RouteDTO) {
    const { token, to } = route.query;
    if (!token) throw HttpAdapter.badRequest("Token is required");

    const user = await this.authTokenUserUseCase.execute(token);
    const userJson = user.toJson();

    const sessionUser: User = {
      id: String(userJson.id),
      name: userJson.name,
      email: userJson.email,
      avatar: userJson.avatar ?? "",
      token: userJson.token,
      accountId: user.accountId,
    };

    return AuthService.setAuthStorage(
      route,
      sessionUser,
      to || "/my-campaigns",
    );
  }
}

export { AuthTokenUserController };
