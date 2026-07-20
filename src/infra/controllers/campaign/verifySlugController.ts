import type { VerifySlugUseCase } from "~/app/useCases/campaign/verifySlugUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class VerifySlugController {
  constructor(private verifySlugUseCase: VerifySlugUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const formData = await route.request.formData();
    const slug = formData.get("slug");
    if (!slug || typeof slug !== "string") {
      throw HttpAdapter.badRequest("slug é obrigatório");
    }

    return await this.verifySlugUseCase.execute({ slug, token: user.token });
  }
}

export { VerifySlugController };
