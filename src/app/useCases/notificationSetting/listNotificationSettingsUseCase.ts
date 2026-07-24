import type { NotificationSettingGatewayDTO } from "~/domain/gateways/notificationSetting";

class ListNotificationSettingsUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(accountUuid: string) {
    const settings =
      await this.gateway.listNotificationSettings(accountUuid);
    return settings.map((s) => s.toJson());
  }
}

export { ListNotificationSettingsUseCase };
