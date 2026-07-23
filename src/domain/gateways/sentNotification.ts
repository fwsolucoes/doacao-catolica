import type { SentNotificationsSearchParams } from "~/app/search/sentNotificationsSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { SentNotification } from "../entities/sentNotification";

type SentNotificationGatewayDTO = {
  listSentNotifications(
    campaignId: string,
    searchParams: SentNotificationsSearchParams,
  ): Promise<SearchResult<SentNotification>>;
};

export type { SentNotificationGatewayDTO };
