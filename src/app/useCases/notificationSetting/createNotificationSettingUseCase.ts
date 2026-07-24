import type {
  CreateNotificationSettingData,
  NotificationSettingGatewayDTO,
} from "~/domain/gateways/notificationSetting";

class CreateNotificationSettingUseCase {
  constructor(private gateway: NotificationSettingGatewayDTO) {}

  async execute(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void> {
    await this.gateway.createNotificationSetting(accountUuid, data);
  }
}

export { CreateNotificationSettingUseCase };
