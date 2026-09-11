import { buildWhatsAppHref } from "~/lib/buildWhatsAppHref";
import { formatPhone } from "~/lib/formatPhone";

const NOT_INFORMED = "Não informado";

type DonorProps = {
  customerId: number;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  unpaidDonationsCount: number;
  pendingAmount: number;
  totalPaidAmount: number;
  totalPaidDonationsCount: number;
};

type DefaultingDonorsProps = {
  totalDefaultingDonors: number;
  totalPendingAmount: number;
  averageAmountPerDonor: number;
  averageMonthlyAmount: number;
  donors: DonorProps[];
};

type DefaultingDonorJson = {
  customerId: string;
  name: string;
  email: string;
  phoneDisplay: string;
  whatsappHref: string | null;
  createdAt: string;
  unpaidDonationsCount: number;
  pendingAmount: string;
  totalPaidAmount: string;
  totalPaidDonationsCount: number;
};

type DefaultingDonorsJson = {
  totalDefaultingDonors: number;
  totalPendingAmount: string;
  averageAmountPerDonor: string;
  averageMonthlyAmount: string;
  donors: DefaultingDonorJson[];
};

class DefaultingDonors {
  private constructor(private readonly props: DefaultingDonorsProps) {}

  static restore(props: DefaultingDonorsProps) {
    return new DefaultingDonors(props);
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

  private formatDonor(donor: DonorProps): DefaultingDonorJson {
    const formatted = formatPhone(donor.phone);
    return {
      customerId: String(donor.customerId),
      name: donor.name,
      email: donor.email ?? NOT_INFORMED,
      phoneDisplay: formatted || NOT_INFORMED,
      whatsappHref: buildWhatsAppHref(donor.phone),
      createdAt: this.formatDate(donor.createdAt),
      unpaidDonationsCount: donor.unpaidDonationsCount,
      pendingAmount: this.formatCurrency(donor.pendingAmount),
      totalPaidAmount: this.formatCurrency(donor.totalPaidAmount),
      totalPaidDonationsCount: donor.totalPaidDonationsCount,
    };
  }

  toJson(): DefaultingDonorsJson {
    return {
      totalDefaultingDonors: this.props.totalDefaultingDonors,
      totalPendingAmount: this.formatCurrency(this.props.totalPendingAmount),
      averageAmountPerDonor: this.formatCurrency(
        this.props.averageAmountPerDonor,
      ),
      averageMonthlyAmount: this.formatCurrency(this.props.averageMonthlyAmount),
      donors: this.props.donors.map((d) => this.formatDonor(d)),
    };
  }
}

export { DefaultingDonors };
export type { DefaultingDonorsJson, DefaultingDonorJson };
