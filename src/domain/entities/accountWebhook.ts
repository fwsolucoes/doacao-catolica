type AccountWebhookProps = {
  id: string;
  url: string;
  // known values: "*" | "payment.confirmed" | "payment.received" | "payment.manual"
  // | "subscription.created" | "subscription.inactivated"
  events: string[];
  active: boolean;
};

class AccountWebhook {
  readonly id: string;
  readonly url: string;
  readonly events: string[];
  readonly active: boolean;

  private constructor(props: AccountWebhookProps) {
    this.id = props.id;
    this.url = props.url;
    this.events = props.events;
    this.active = props.active;
  }

  static restore(props: AccountWebhookProps): AccountWebhook {
    return new AccountWebhook(props);
  }

  toJson() {
    return {
      id: this.id,
      url: this.url,
      events: this.events,
      active: this.active,
    };
  }
}

type AccountWebhookJson = ReturnType<AccountWebhook["toJson"]>;

export { AccountWebhook };
export type { AccountWebhookJson, AccountWebhookProps };
