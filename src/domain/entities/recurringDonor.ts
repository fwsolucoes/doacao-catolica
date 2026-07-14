import { FormatAdapter } from "~/infra/adapters/formatAdapter";

type RecurringDonorProps = {
  subscriptionUuid: string;
  customerUuid: string;
  customerReference: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  donationsLast12Months: number;
  lastDonationAt: string | null;
  status: boolean;
  activeNotification: boolean;
  amount: number;
  payDay: number;
  paymentMethod: "automatic_pix" | "pix" | "bank_slip" | "credit_card";
  registeredAt: string;
};

class RecurringDonor {
  readonly subscriptionUuid: string;
  readonly customerUuid: string;
  readonly customerReference: string;
  readonly name: string;
  readonly cpf: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly donationsLast12Months: number;
  readonly lastDonationAt: string | null;
  readonly status: boolean;
  readonly activeNotification: boolean;
  readonly amount: number;
  readonly payDay: number;
  readonly paymentMethod: "automatic_pix" | "pix" | "bank_slip" | "credit_card";
  readonly registeredAt: string;

  private constructor(props: RecurringDonorProps) {
    this.subscriptionUuid = props.subscriptionUuid;
    this.customerUuid = props.customerUuid;
    this.customerReference = props.customerReference;
    this.name = props.name;
    this.cpf = props.cpf;
    this.email = props.email;
    this.phone = props.phone;
    this.donationsLast12Months = props.donationsLast12Months;
    this.lastDonationAt = props.lastDonationAt;
    this.status = props.status;
    this.activeNotification = props.activeNotification;
    this.amount = props.amount;
    this.payDay = props.payDay;
    this.paymentMethod = props.paymentMethod;
    this.registeredAt = props.registeredAt;
  }

  static restore(props: RecurringDonorProps): RecurringDonor {
    return new RecurringDonor(props);
  }

  toJson() {
    return {
      subscriptionUuid: this.subscriptionUuid,
      customerUuid: this.customerUuid,
      customerReference: this.customerReference,
      name: this.name,
      cpf: FormatAdapter.cpfCnpj(this.cpf),
      email: this.email,
      phone: FormatAdapter.phone(this.phone),
      donationsLast12Months: this.donationsLast12Months,
      lastDonationAt: this.lastDonationAt,
      status: this.status,
      activeNotification: this.activeNotification,
      amount: this.amount,
      payDay: this.payDay,
      paymentMethod: this.paymentMethod,
      registeredAt: this.registeredAt,
    };
  }
}

export { RecurringDonor };
export type { RecurringDonorProps };
