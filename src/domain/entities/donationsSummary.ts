type DonationsSummaryProps = {
  averageTicketPeriod: number;
  averageTicketPreviousMonth: number;
  variationPercentage: number | null;
  oneTimeDonationsAmount: number;
  recurringDonationsAmount: number;
  subscriptionsActiveCount: number;
  subscriptionsActiveAmount: number;
  subscriptionsCreatedInPeriodActiveCount: number;
  subscriptionsCreatedInPeriodActiveAmount: number;
};

class DonationsSummary {
  private constructor(private props: DonationsSummaryProps) {}

  static restore(props: DonationsSummaryProps): DonationsSummary {
    return new DonationsSummary(props);
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const variation = this.props.variationPercentage;
    const variationStr =
      variation === null
        ? null
        : `${variation >= 0 ? "+" : ""}${variation.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}%`;

    return {
      averageTicketPeriod: fmt(this.props.averageTicketPeriod),
      averageTicketPreviousMonth: fmt(this.props.averageTicketPreviousMonth),
      variationPercentage: variationStr,
      oneTimeDonationsAmount: fmt(this.props.oneTimeDonationsAmount),
      recurringDonationsAmount: fmt(this.props.recurringDonationsAmount),
      subscriptionsActiveCount: String(this.props.subscriptionsActiveCount),
      subscriptionsActiveAmount: fmt(this.props.subscriptionsActiveAmount),
      subscriptionsCreatedInPeriodActiveCount: this.props.subscriptionsCreatedInPeriodActiveCount,
      subscriptionsCreatedInPeriodActiveAmount: fmt(
        this.props.subscriptionsCreatedInPeriodActiveAmount,
      ),
    };
  }
}

type DonationsSummaryJson = ReturnType<DonationsSummary["toJson"]>;

export { DonationsSummary, type DonationsSummaryJson };
