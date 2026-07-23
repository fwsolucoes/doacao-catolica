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
      startDate: route.query.start_date,
      endDate: route.query.end_date,
      notificationType: route.query.notification_type,
      logType: route.query.log_type,
      channel: route.query.channel,
    });
  }
}

export { ListSentNotificationsController };
