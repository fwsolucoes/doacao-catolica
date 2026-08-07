import type { FindDonatorContactUseCase } from "~/app/useCases/donor/findDonatorContactUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class FindDonatorContactController {
  constructor(private findDonatorContactUseCase: FindDonatorContactUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const donatorsId = route.query.donatorsId;
    if (!donatorsId) throw HttpAdapter.badRequest("donatorsId is required");

    const contactId = await this.findDonatorContactUseCase.execute(
      donatorsId,
      user.token,
    );

    return { contactId };
  }
}

export { FindDonatorContactController };
