import { buildWhatsAppHref } from "~/lib/buildWhatsAppHref";
import { formatPhone } from "~/lib/formatPhone";

const NOT_INFORMED = "Não informado";

type RegistrationProps = {
  customerId: number;
  customerUuid: string;
  name: string;
  document: string | null;
  phone: string | null;
  email: string | null;
  amount: number;
  paymentMethodLabel: string;
  typeLabel: string;
  createdAt: string;
};

type RegistrationsWithoutDonationsProps = {
  totalCount: number;
  recurringCount: number;
  oneTimeCount: number;
  monthlyPotentialAmount: number;
  registrations: RegistrationProps[];
  page: number;
  totalPages: number;
  totalItems: number;
};

type RegistrationJson = {
  customerId: string;
  customerUuid: string;
  name: string;
  document: string;
  phoneDisplay: string;
  whatsappHref: string | null;
  email: string;
  chosenAmount: string;
  paymentMethod: string;
  type: string;
  registeredAt: string;
};

type RegistrationsWithoutDonationsSummaryJson = {
  totalCount: number;
  recurringCount: number;
  oneTimeCount: number;
  monthlyPotentialAmount: string;
};

type RegistrationsWithoutDonationsJson = {
  summary: RegistrationsWithoutDonationsSummaryJson;
  registrations: RegistrationJson[];
  meta: { page: number; totalPages: number; totalItems: number };
};

class RegistrationsWithoutDonations {
  private constructor(
    private readonly props: RegistrationsWithoutDonationsProps,
  ) {}

  static restore(props: RegistrationsWithoutDonationsProps) {
    return new RegistrationsWithoutDonations(props);
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  private formatDate(raw: string): string {
    const datePart = raw.split(" ")[0];
    if (!datePart) return raw;
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return raw;
    return `${day}/${month}/${year}`;
  }

  private formatRegistration(registration: RegistrationProps): RegistrationJson {
    return {
      customerId: String(registration.customerId),
      customerUuid: registration.customerUuid,
      name: registration.name,
      document: registration.document ?? NOT_INFORMED,
      phoneDisplay: formatPhone(registration.phone) || NOT_INFORMED,
      whatsappHref: buildWhatsAppHref(registration.phone),
      email: registration.email ?? NOT_INFORMED,
      chosenAmount: this.formatCurrency(registration.amount),
      paymentMethod: registration.paymentMethodLabel,
      type: registration.typeLabel,
      registeredAt: this.formatDate(registration.createdAt),
    };
  }

  toJson(): RegistrationsWithoutDonationsJson {
    return {
      summary: {
        totalCount: this.props.totalCount,
        recurringCount: this.props.recurringCount,
        oneTimeCount: this.props.oneTimeCount,
        monthlyPotentialAmount: this.formatCurrency(
          this.props.monthlyPotentialAmount,
        ),
      },
      registrations: this.props.registrations.map((r) =>
        this.formatRegistration(r),
      ),
      meta: {
        page: this.props.page,
        totalPages: this.props.totalPages,
        totalItems: this.props.totalItems,
      },
    };
  }
}

export { RegistrationsWithoutDonations };
export type { RegistrationsWithoutDonationsJson, RegistrationJson };
