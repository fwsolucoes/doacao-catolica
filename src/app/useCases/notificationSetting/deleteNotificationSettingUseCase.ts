import type { NotificationSettingGatewayDTO } from "~/domain/gateways/notificationSetting";

class DeleteNotificationSettingUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(uuid: string): Promise<void> {
    await this.gateway.deleteNotificationSetting(uuid);
  }
}

export { DeleteNotificationSettingUseCase };
