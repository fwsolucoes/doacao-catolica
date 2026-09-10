type TotalPaymentsByAccountProps = {
  releasedAmount: number;
  receivedOnlineAmount: number;
  receivedOfflineAmount: number;
  awaitingPaymentAmount: number;
  overdueAmount: number;
  canceledAmount: number;
  feeAmount: number;
};

class TotalPaymentsByAccount {
  private constructor(private props: TotalPaymentsByAccountProps) {}

  static restore(props: TotalPaymentsByAccountProps): TotalPaymentsByAccount {
    return new TotalPaymentsByAccount(props);
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const pending =
      this.props.awaitingPaymentAmount +
      this.props.overdueAmount +
      this.props.canceledAmount;

    return {
      released: fmt(this.props.releasedAmount),
      receivedOnline: fmt(this.props.receivedOnlineAmount),
      receivedOffline: fmt(this.props.receivedOfflineAmount),
      awaitingRelease: fmt(this.props.awaitingPaymentAmount),
      overdue: fmt(this.props.overdueAmount),
      canceled: fmt(this.props.canceledAmount),
      pending: fmt(pending),
      appliedFees: fmt(this.props.feeAmount),
    };
  }
}

type TotalPaymentsByAccountJson = ReturnType<
  TotalPaymentsByAccount["toJson"]
>;

export { TotalPaymentsByAccount, type TotalPaymentsByAccountJson };
