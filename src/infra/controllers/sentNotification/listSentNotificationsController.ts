import type { ListSentNotificationsUseCase } from "~/app/useCases/sentNotification/listSentNotificationsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListSentNotificationsController {
  constructor(
    private listSentNotificationsUseCase: ListSentNotificationsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listSentNotificationsUseCase.execute({
      campaignId,
      page,
      search: route.query.search,
      notificationType: route.query.notification_type,
      logType: route.query.log_type,
    });
  }
}

export { ListSentNotificationsController };
