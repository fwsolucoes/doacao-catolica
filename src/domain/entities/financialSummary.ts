type FinancialSummaryCampaignProps = {
  id: number;
  uuid: string;
  name: string;
  status: string;
  totalRaisedAmount: number;
  onlineAmount: number;
  offlineAmount: number;
  availableBalance: number;
  averageTicket: number;
  totalPaidPayments: number;
};

type FinancialSummaryProps = {
  totalRaisedAmount: number;
  onlineAmount: number;
  offlineAmount: number;
  availableBalance: number;
  averageTicket: number;
  totalPaidPayments: number;
  totalCampaigns: number;
  campaigns: FinancialSummaryCampaignProps[];
};

class FinancialSummary {
  private constructor(private props: FinancialSummaryProps) {}

  static restore(props: FinancialSummaryProps): FinancialSummary {
    return new FinancialSummary(props);
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return {
      totalRaisedAmount: fmt(this.props.totalRaisedAmount),
      onlineAmount: fmt(this.props.onlineAmount),
      offlineAmount: fmt(this.props.offlineAmount),
      availableBalance: fmt(this.props.availableBalance),
      averageTicket: fmt(this.props.averageTicket),
      totalPaidPayments: this.props.totalPaidPayments,
      totalCampaigns: this.props.totalCampaigns,
      campaigns: this.props.campaigns.map((c) => ({
        id: c.id,
        uuid: c.uuid,
        name: c.name,
        status: c.status,
        totalRaisedAmount: fmt(c.totalRaisedAmount),
        onlineAmount: fmt(c.onlineAmount),
        offlineAmount: fmt(c.offlineAmount),
        availableBalance: fmt(c.availableBalance),
        averageTicket: fmt(c.averageTicket),
        totalPaidPayments: c.totalPaidPayments,
      })),
    };
  }
}

type FinancialSummaryJson = ReturnType<FinancialSummary["toJson"]>;

export { FinancialSummary, type FinancialSummaryJson };
