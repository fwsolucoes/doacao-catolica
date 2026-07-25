import type { NotificationSettingGatewayDTO } from "~/domain/gateways/notificationSetting";

class ToggleNotificationSettingUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(accountUuid: string, uuid: string, active: boolean): Promise<void> {
    await this.gateway.toggleNotificationSetting(accountUuid, uuid, active);
  }
}

export { ToggleNotificationSettingUseCase };
