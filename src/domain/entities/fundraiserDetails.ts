import { formatCurrency } from "~/lib/formatCurrency";

type FundraiserDetailsProps = {
  affiliateReference: string;
  totalIndications: number;
  periodTotalRaisedAmount: number | null;
  last30DaysTotalIndications: number;
  last30DaysTotalRaisedAmount: number;
  totalRecurringAmount: number;
};

type FundraiserDetailsJson = {
  affiliateReference: string;
  totalIndications: number;
  last30DaysTotalIndications: number;
  last30DaysTotalRaisedAmount: string;
  totalRecurringAmount: string;
  comparisonPercent: string | null;
  previousMonthAmount: string | null;
};

class FundraiserDetails {
  private constructor(private readonly props: FundraiserDetailsProps) {}

  static restore(props: FundraiserDetailsProps): FundraiserDetails {
    return new FundraiserDetails(props);
  }

  toJson(): FundraiserDetailsJson {
    const prev = this.props.periodTotalRaisedAmount;
    const curr = this.props.last30DaysTotalRaisedAmount;

    let comparisonPercent: string | null = null;
    let previousMonthAmount: string | null = null;

    if (prev !== null) {
      previousMonthAmount = formatCurrency(String(prev));
      if (prev !== 0) {
        const pct = ((curr - prev) / prev) * 100;
        const sign = pct >= 0 ? "+" : "";
        comparisonPercent = `${sign}${pct.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}%`;
      }
    }

    return {
      affiliateReference: this.props.affiliateReference,
      totalIndications: this.props.totalIndications,
      last30DaysTotalIndications: this.props.last30DaysTotalIndications,
      last30DaysTotalRaisedAmount: formatCurrency(
        String(this.props.last30DaysTotalRaisedAmount),
      ),
      totalRecurringAmount: formatCurrency(String(this.props.totalRecurringAmount)),
      comparisonPercent,
      previousMonthAmount,
    };
  }
}

export { FundraiserDetails };
export type { FundraiserDetailsJson };
