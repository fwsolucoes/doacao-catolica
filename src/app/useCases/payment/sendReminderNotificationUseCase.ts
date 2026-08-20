import type { PaymentGatewayDTO } from "~/domain/gateways/payment";

class SendReminderNotificationUseCase {
  constructor(private gateway: PaymentGatewayDTO) {}

  async execute(paymentUuid: string): Promise<string> {
    return await this.gateway.sendReminderNotification(paymentUuid);
  }
}

export { SendReminderNotificationUseCase };
