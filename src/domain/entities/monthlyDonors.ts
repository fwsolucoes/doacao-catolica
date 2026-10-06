import { buildWhatsAppHref } from "~/lib/buildWhatsAppHref";
import { formatPhone } from "~/lib/formatPhone";

const NOT_INFORMED = "Não informado";
const EMPTY_VALUE = "-";

type MonthlyDonorProps = {
  customerId: number;
  customerUuid: string;
  name: string;
  document: string | null;
  phone: string | null;
  campaignName: string;
  monthlyAmounts: Record<string, number | null>;
  totalAmount: number;
};

type MonthlyDonorsProps = {
  months: string[];
  donors: MonthlyDonorProps[];
  page: number;
  pageLimit: number;
  totalItems: number;
};

type MonthlyDonorJson = {
  customerId: string;
  customerUuid: string;
  name: string;
  document: string;
  phoneDisplay: string;
  whatsappHref: string | null;
  campaignName: string;
  monthlyAmounts: Record<string, string>;
  totalAmount: string;
};

type MonthlyDonorsJson = {
  months: string[];
  donors: MonthlyDonorJson[];
  meta: {
    page: number;
    pageLimit: number;
    totalItems: number;
    totalPages: number;
  };
};

class MonthlyDonors {
  private constructor(private readonly props: MonthlyDonorsProps) {}

  static restore(props: MonthlyDonorsProps) {
    return new MonthlyDonors(props);
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  private formatDonor(donor: MonthlyDonorProps): MonthlyDonorJson {
    const monthlyAmounts: Record<string, string> = {};
    for (const [month, amount] of Object.entries(donor.monthlyAmounts)) {
      monthlyAmounts[month] =
        amount === null ? EMPTY_VALUE : this.formatCurrency(amount);
    }

    return {
      customerId: String(donor.customerId),
      customerUuid: donor.customerUuid,
      name: donor.name,
      document: donor.document ?? NOT_INFORMED,
      phoneDisplay: formatPhone(donor.phone) || NOT_INFORMED,
      whatsappHref: buildWhatsAppHref(donor.phone),
      campaignName: donor.campaignName,
      monthlyAmounts,
      totalAmount: this.formatCurrency(donor.totalAmount),
    };
  }

  toJson(): MonthlyDonorsJson {
    return {
      months: this.props.months,
      donors: this.props.donors.map((donor) => this.formatDonor(donor)),
      meta: {
        page: this.props.page,
        pageLimit: this.props.pageLimit,
        totalItems: this.props.totalItems,
        totalPages: Math.ceil(this.props.totalItems / this.props.pageLimit),
      },
    };
  }
}

export { MonthlyDonors };
export type { MonthlyDonorsJson, MonthlyDonorJson };
