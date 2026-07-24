import type { NotificationSetting } from "../entities/notificationSetting";

type NotificationSettingGatewayDTO = {
  listNotificationSettings(accountUuid: string): Promise<NotificationSetting[]>;
};

export type { NotificationSettingGatewayDTO };
