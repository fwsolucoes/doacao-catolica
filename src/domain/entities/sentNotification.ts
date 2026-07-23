type SentNotificationProps = {
  uuid: string;
  // known values: "whatsapp" | "email" | "sms"
  channel: string;
  // known values: "payment_before_due_date" | "payment_after_due_date" | ...
  notificationType: string;
  // known values: "success" | "error" | "not_send" | "blocked" | "awaiting_confirmation"
  logType: string;
  entityName: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  response: string;
  createdAt: string;
  createdAtTime: string;
};

class SentNotification {
  readonly uuid: string;
  readonly channel: string;
  readonly notificationType: string;
  readonly logType: string;
  readonly entityName: string;
  readonly customerName: string | null;
  readonly customerEmail: string | null;
  readonly customerPhone: string | null;
  readonly response: string;
  readonly createdAt: string;
  readonly createdAtTime: string;

  private constructor(props: SentNotificationProps) {
    this.uuid = props.uuid;
    this.channel = props.channel;
    this.notificationType = props.notificationType;
    this.logType = props.logType;
    this.entityName = props.entityName;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.response = props.response;
    this.createdAt = props.createdAt;
    this.createdAtTime = props.createdAtTime;
  }

  static restore(props: SentNotificationProps): SentNotification {
    return new SentNotification(props);
  }

  toJson() {
    return {
      uuid: this.uuid,
      channel: this.channel,
      notificationType: this.notificationType,
      logType: this.logType,
      entityName: this.entityName,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      response: this.response,
      createdAt: this.createdAt,
      createdAtTime: this.createdAtTime,
    };
  }
}

export { SentNotification };
export type { SentNotificationProps };
