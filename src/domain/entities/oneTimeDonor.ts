import { FormatAdapter } from "~/infra/adapters/formatAdapter";

type OneTimeDonorProps = {
  transferUuid: string;
  customerUuid: string;
  customerReference: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  registeredAt: string;
  isRecurring: boolean;
  recurringSince: string | null;
  amount: number;
  paymentMethod: string;
  lastDonationAt: string | null;
};

class OneTimeDonor {
  readonly transferUuid: string;
  readonly customerUuid: string;
  readonly customerReference: string;
  readonly name: string;
  readonly cpf: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly registeredAt: string;
  readonly isRecurring: boolean;
  readonly recurringSince: string | null;
  readonly amount: number;
  readonly paymentMethod: string;
  readonly lastDonationAt: string | null;

  private constructor(props: OneTimeDonorProps) {
    this.transferUuid = props.transferUuid;
    this.customerUuid = props.customerUuid;
    this.customerReference = props.customerReference;
    this.name = props.name;
    this.cpf = props.cpf;
    this.email = props.email;
    this.phone = props.phone;
    this.registeredAt = props.registeredAt;
    this.isRecurring = props.isRecurring;
    this.recurringSince = props.recurringSince;
    this.amount = props.amount;
    this.paymentMethod = props.paymentMethod;
    this.lastDonationAt = props.lastDonationAt;
  }

  static restore(props: OneTimeDonorProps): OneTimeDonor {
    return new OneTimeDonor(props);
  }

  toJson() {
    return {
      transferUuid: this.transferUuid,
      customerUuid: this.customerUuid,
      customerReference: this.customerReference,
      name: this.name,
      cpf: FormatAdapter.cpfCnpj(this.cpf),
      email: this.email,
      phone: FormatAdapter.phone(this.phone),
      registeredAt: this.registeredAt,
      isRecurring: this.isRecurring,
      recurringSince: this.recurringSince,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      lastDonationAt: this.lastDonationAt,
    };
  }
}

export { OneTimeDonor };
export type { OneTimeDonorProps };
