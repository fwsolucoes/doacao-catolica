import type {
  NotificationSettingGatewayDTO,
  UpdateNotificationSettingData,
} from "~/domain/gateways/notificationSetting";

class UpdateNotificationSettingUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(
    accountUuid: string,
    uuid: string,
    data: UpdateNotificationSettingData,
  ): Promise<void> {
    await this.gateway.updateNotificationSetting(accountUuid, uuid, data);
  }
}

export { UpdateNotificationSettingUseCase };
