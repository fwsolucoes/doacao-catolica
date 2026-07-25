import { NotificationSetting } from "~/domain/entities/notificationSetting";
import type {
  CreateNotificationSettingData,
  NotificationSettingGatewayDTO,
  UpdateNotificationSettingData,
} from "~/domain/gateways/notificationSetting";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { notificationSettingsSchema } from "../schemas/external/notificationSettings";

class NotificationSettingGateway implements NotificationSettingGatewayDTO {
  async listNotificationSettings(
    accountUuid: string,
  ): Promise<NotificationSetting[]> {
    const url = `/api/notifications_settings/account/${accountUuid}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(
      notificationSettingsSchema,
    ).validate(apiResponse.response);

    return validated.data.map((item) =>
      NotificationSetting.restore({
        uuid: item.uuid,
        active: item.active,
        type: item.type,
        name: item.name,
        days: item.days,
        whatsappMessage: item.whatsapp_message,
        mailSubject: item.mail_subject,
        mailMessage: item.mail_message,
        enableWhatsapp: item.enable_whatsapp,
        enableMail: item.enable_mail,
        enablePix: item.enable_pix,
        enableCreditCard: item.enable_credit_card,
        enableBankSlip: item.enable_bank_slip,
        bannerImage: item.banner_image,
        webhookUrl: item.webhook_url,
        keywordFlow: item.keyword_flow,
        whatsappType: item.whatsapp_type,
        createdAt: item.created_at2,
        updatedAt: item.updated_at2,
        deletedAt: item.deleted_at2,
      }),
    );
  }

  async createNotificationSetting(
    accountUuid: string,
    data: CreateNotificationSettingData,
  ): Promise<void> {
    const apiResponse = await donationApi.post("/api/notifications_settings", {
      body: {
        account_reference: accountUuid,
        type: data.type,
        name: data.name,
        days: data.days,
        whatsapp_message: data.whatsappMessage || undefined,
        mail_subject: data.mailSubject || undefined,
        mail_message: data.mailMessage || undefined,
        banner_image: data.bannerImage || undefined,
        enable_whatsapp: data.enableWhatsapp,
        enable_mail: data.enableMail,
        enable_pix: data.enablePix,
        enable_credit_card: data.enableCreditCard,
        enable_bank_slip: data.enableBankSlip,
      },
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async updateNotificationSetting(
    accountUuid: string,
    uuid: string,
    data: UpdateNotificationSettingData,
  ): Promise<void> {
    const apiResponse = await donationApi.put(
      `/api/notifications_settings/${uuid}`,
      {
        body: {
          account_reference: accountUuid,
          type: data.type,
          name: data.name,
          days: data.days,
          whatsapp_message: data.whatsappMessage || undefined,
          mail_subject: data.mailSubject || undefined,
          mail_message: data.mailMessage || undefined,
          banner_image: data.bannerImage || undefined,
          enable_whatsapp: data.enableWhatsapp,
          enable_mail: data.enableMail,
          enable_pix: data.enablePix,
          enable_credit_card: data.enableCreditCard,
          enable_bank_slip: data.enableBankSlip,
        },
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async toggleNotificationSetting(
    accountUuid: string,
    uuid: string,
    active: boolean,
  ): Promise<void> {
    const apiResponse = await donationApi.put(
      `/api/notifications_settings/${uuid}`,
      {
        body: { account_reference: accountUuid, active },
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async deleteNotificationSetting(uuid: string): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/notifications_settings/${uuid}`,
      { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { NotificationSettingGateway };
