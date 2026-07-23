import { SentNotificationsSearchParams } from "~/app/search/sentNotificationsSearchParams";
import type { SentNotificationGatewayDTO } from "~/domain/gateways/sentNotification";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  notificationType?: string;
  logType?: string;
};

class ListSentNotificationsUseCase {
  constructor(private gateway: SentNotificationGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, page, search, notificationType, logType } = input;

    const searchParams = new SentNotificationsSearchParams({
      page: page ?? 1,
      filter: {
        per_page: 20,
        search,
        notification_type: notificationType,
        log_type: logType,
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
