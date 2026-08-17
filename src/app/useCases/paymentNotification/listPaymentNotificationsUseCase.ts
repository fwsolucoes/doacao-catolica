import type { PaymentNotificationGatewayDTO } from "~/domain/gateways/paymentNotification";

type InputProps = {
  accountUuid: string;
  paymentUuid: string;
};

class ListPaymentNotificationsUseCase {
  constructor(private gateway: PaymentNotificationGatewayDTO) {}

  async execute({ accountUuid, paymentUuid }: InputProps) {
    const notifications = await this.gateway.listPaymentNotifications(
      accountUuid,
      paymentUuid,
    );
    return notifications.map((n) => n.toJson());
  }
}

export { ListPaymentNotificationsUseCase };
