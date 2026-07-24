import type { ListNotificationSettingsUseCase } from "~/app/useCases/notificationSetting/listNotificationSettingsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListNotificationSettingsController {
  constructor(
    private listNotificationSettingsUseCase: ListNotificationSettingsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.listNotificationSettingsUseCase.execute(campaignId);
  }
}

export { ListNotificationSettingsController };
