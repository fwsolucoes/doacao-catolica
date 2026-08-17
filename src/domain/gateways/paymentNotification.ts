import type { SentNotification } from "~/domain/entities/sentNotification";

type PaymentNotificationGatewayDTO = {
  listPaymentNotifications(
    accountUuid: string,
    paymentUuid: string,
  ): Promise<SentNotification[]>;
};

export type { PaymentNotificationGatewayDTO };
