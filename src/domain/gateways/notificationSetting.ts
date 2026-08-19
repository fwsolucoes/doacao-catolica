import type { NotificationSetting } from "../entities/notificationSetting";

type CreateNotificationSettingData = {
  name: string;
  type: string;
  days: number;
  whatsappMessage: string | null;
  mailSubject: string;
  mailMessage: string;
  bannerImage: string | null;
  enableWhatsapp: boolean;
  enableMail: boolean;
  enablePix: boolean;
  enableCreditCard: boolean;
  enableBankSlip: boolean;
};

type UpdateNotificationSettingData = {
  name: string;
  type: string;
  days: number;
  whatsappMessage: string | null;
  mailSubject: string;
  mailMessage: string;
  bannerImage: string | null;
  enableWhatsapp: boolean;
  enableMail: boolean;
  enablePix: boolean;
  enableCreditCard: boolean;
  enableBankSlip: boolean;
};

type NotificationSettingGatewayDTO = {
  listNotificationSettings(accountUuid: string): Promise<NotificationSetting[]>;
  createNotificationSetting(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void>;
  updateNotificationSetting(
    accountUuid: string,
    uuid: string,
    data: UpdateNotificationSettingData,
  ): Promise<void>;
  deleteNotificationSetting(uuid: string): Promise<void>;
  toggleNotificationSetting(accountUuid: string, uuid: string, active: boolean): Promise<void>;
};

export type {
  NotificationSettingGatewayDTO,
  CreateNotificationSettingData,
  UpdateNotificationSettingData,
};
