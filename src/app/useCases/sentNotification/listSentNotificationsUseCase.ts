import { SentNotificationsSearchParams } from "~/app/search/sentNotificationsSearchParams";
import type { SentNotificationGatewayDTO } from "~/domain/gateways/sentNotification";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  startDate?: string;
  endDate?: string;
  notificationType?: string;
  logType?: string;
  channel?: string;
};

class ListSentNotificationsUseCase {
  constructor(private gateway: SentNotificationGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      campaignId,
      page,
      search,
      startDate,
      endDate,
      notificationType,
      logType,
      channel,
    } = input;

    const searchParams = new SentNotificationsSearchParams({
      page: page ?? 1,
      filter: {
        per_page: 20,
        search,
        start_date: startDate,
        end_date: endDate,
        notification_type: notificationType,
        log_type: logType,
        channel,
      },
    });

    const result = await this.gateway.listSentNotifications(
      campaignId,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListSentNotificationsUseCase };
