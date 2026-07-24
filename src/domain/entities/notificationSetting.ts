type NotificationSettingProps = {
  uuid: string;
  active: number;
  // known values: "payment_before_due_date" | "payment_on_due_date" | "payment_after_due_date" | "payment_paid" | "subscription_created_externally" | "instant_reminder"
  type: string;
  name: string;
  days: number;
  whatsappMessage: string;
  mailSubject: string;
  mailMessage: string;
  enableWhatsapp: number;
  enableMail: number;
  enablePix: number;
  enableCreditCard: number;
  enableBankSlip: number;
  bannerImage: string | null;
  webhookUrl: string | null;
  keywordFlow: string | null;
  whatsappType: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

class NotificationSetting {
  readonly uuid: string;
  readonly active: number;
  readonly type: string;
  readonly name: string;
  readonly days: number;
  readonly whatsappMessage: string;
  readonly mailSubject: string;
  readonly mailMessage: string;
  readonly enableWhatsapp: number;
  readonly enableMail: number;
  readonly enablePix: number;
  readonly enableCreditCard: number;
  readonly enableBankSlip: number;
  readonly bannerImage: string | null;
  readonly webhookUrl: string | null;
  readonly keywordFlow: string | null;
  readonly whatsappType: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;

  private constructor(props: NotificationSettingProps) {
    this.uuid = props.uuid;
    this.active = props.active;
    this.type = props.type;
    this.name = props.name;
    this.days = props.days;
    this.whatsappMessage = props.whatsappMessage;
    this.mailSubject = props.mailSubject;
    this.mailMessage = props.mailMessage;
    this.enableWhatsapp = props.enableWhatsapp;
    this.enableMail = props.enableMail;
    this.enablePix = props.enablePix;
    this.enableCreditCard = props.enableCreditCard;
    this.enableBankSlip = props.enableBankSlip;
    this.bannerImage = props.bannerImage;
    this.webhookUrl = props.webhookUrl;
    this.keywordFlow = props.keywordFlow;
    this.whatsappType = props.whatsappType;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  static restore(props: NotificationSettingProps): NotificationSetting {
    return new NotificationSetting(props);
  }

  toJson() {
    return {
      uuid: this.uuid,
      active: this.active === 1,
      type: this.type,
      name: this.name,
      days: this.days,
      whatsappMessage: this.whatsappMessage,
      mailSubject: this.mailSubject,
      mailMessage: this.mailMessage,
      enableWhatsapp: this.enableWhatsapp === 1,
      enableMail: this.enableMail === 1,
      enablePix: this.enablePix === 1,
      enableCreditCard: this.enableCreditCard === 1,
      enableBankSlip: this.enableBankSlip === 1,
      bannerImage: this.bannerImage,
      webhookUrl: this.webhookUrl,
      keywordFlow: this.keywordFlow,
      whatsappType: this.whatsappType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

export { NotificationSetting };
export type { NotificationSettingProps };
