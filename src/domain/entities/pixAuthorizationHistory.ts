type AuthorizationItem = {
  authorizationUuid: string;
  status: string;
  statusLabel: string;
  statusUpdatedAt: string;
};

type PixAuthorizationHistoryProps = {
  customerName: string;
  subscriptionName: string;
  authorizations: AuthorizationItem[];
};

function stripSeconds(datetime: string): string {
  const [date, time] = datetime.split(" ");
  return time ? `${date} ${time.slice(0, 5)}` : datetime;
}

class PixAuthorizationHistory {
  private constructor(private props: PixAuthorizationHistoryProps) {}

  static restore(
    props: PixAuthorizationHistoryProps,
  ): PixAuthorizationHistory {
    return new PixAuthorizationHistory(props);
  }

  toJson() {
    return {
      customerName: this.props.customerName,
      subscriptionName: this.props.subscriptionName,
      authorizations: this.props.authorizations.map((a) => ({
        authorizationUuid: a.authorizationUuid,
        status: a.status,
        statusLabel: a.statusLabel,
        statusUpdatedAt: stripSeconds(a.statusUpdatedAt),
      })),
    };
  }
}

type PixAuthorizationHistoryJson = ReturnType<
  PixAuthorizationHistory["toJson"]
>;

export { PixAuthorizationHistory, type PixAuthorizationHistoryJson };
