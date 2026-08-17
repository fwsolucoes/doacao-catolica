import type { PaymentNotificationGatewayDTO } from "~/domain/gateways/paymentNotification";
import { SentNotification } from "~/domain/entities/sentNotification";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { paymentNotificationsSchema } from "../schemas/external/paymentNotifications";

class PaymentNotificationGateway implements PaymentNotificationGatewayDTO {
  async listPaymentNotifications(
    accountUuid: string,
    paymentUuid: string,
  ): Promise<SentNotification[]> {
    const url = `/api/notification_logs/${accountUuid}/${paymentUuid}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(paymentNotificationsSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.data.map((item) =>
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
    );
  }
}

export { PaymentNotificationGateway };
