import type { SentNotificationsSearchParams } from "~/app/search/sentNotificationsSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { SentNotification } from "~/domain/entities/sentNotification";
import type { SentNotificationGatewayDTO } from "~/domain/gateways/sentNotification";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { sentNotificationsSchema } from "../schemas/external/sentNotifications";

class SentNotificationGateway implements SentNotificationGatewayDTO {
  async listSentNotifications(
    campaignId: string,
    searchParams: SentNotificationsSearchParams,
  ): Promise<SearchResult<SentNotification>> {
    let url = `/api/notification_logs/${campaignId}`;
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(sentNotificationsSchema);
    const validated = schemaValidator.validate(apiResponse.response);
    const { data } = validated;

    return new SearchResult({
      data: data.data.map((item) =>
        SentNotification.restore({
          uuid: item.uuid,
          channel: item.channel,
          notificationType: item.notification_type,
          logType: item.log_type,
          entityName: item.entity_name,
          customerName: item.customer.name,
          customerEmail: item.customer.email,
          customerPhone: item.customer.phone,
          response: item.response,
          createdAt: item.created_at2,
        }),
      ),
      meta: {
        page: data.current_page,
        pageLimit: data.per_page ?? 20,
        totalItems: data.total,
      },
    });
  }
}

export { SentNotificationGateway };
