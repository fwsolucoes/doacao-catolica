import { FormatAdapter } from "~/infra/adapters/formatAdapter";

type PixAuthorizationProps = {
  authorizationUuid: string;
  subscriptionUuid: string;
  status: string;
  statusLabel: string;
  statusUpdatedAt: string;
  authorizationCreatedAt: string | null;
  authorizationsCount: number;
  customerName: string;
  customerPhone: string | null;
  customerCpfCnpj: string | null;
};

function stripSeconds(datetime: string): string {
  const [date, time] = datetime.split(" ");
  return time ? `${date} ${time.slice(0, 5)}` : datetime;
}

class PixAuthorization {
  private constructor(private props: PixAuthorizationProps) {}

  static restore(props: PixAuthorizationProps): PixAuthorization {
    return new PixAuthorization(props);
  }

  toJson() {
    return {
      authorizationUuid: this.props.authorizationUuid,
      subscriptionUuid: this.props.subscriptionUuid,
      status: this.props.status,
      statusLabel: this.props.statusLabel,
      statusUpdatedAt: stripSeconds(this.props.statusUpdatedAt),
      authorizationCreatedAt: this.props.authorizationCreatedAt
        ? stripSeconds(this.props.authorizationCreatedAt)
        : null,
      authorizationsCount: this.props.authorizationsCount,
      customerName: this.props.customerName,
      customerPhone: FormatAdapter.phone(this.props.customerPhone),
      customerCpfCnpj: FormatAdapter.cpfCnpj(this.props.customerCpfCnpj),
    };
  }
}

type PixAuthorizationJson = ReturnType<PixAuthorization["toJson"]>;

export { PixAuthorization, type PixAuthorizationJson };
