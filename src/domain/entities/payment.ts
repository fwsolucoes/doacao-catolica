import { FormatAdapter } from "~/infra/adapters/formatAdapter";

const STATUS_MAP: Record<string, string> = {
  failed: "Falha no pagamento",
  overdue: "Vencido",
  created: "Aguardando pagamento",
  awaiting_payment: "Aguardando pagamento",
  canceled: "Cancelado",
  confirmed: "Pagamento confirmado",
  received: "Disponível para saque",
  manual: "Recebido",
  refunded: "Estornado",
  deleted: "Excluído",
  processing: "Processando",
};

const PAYMENT_TYPE_MAP: Record<string, string> = {
  pix: "Pix",
  automatic_pix: "Pix automático",
  bank_slip: "Boleto",
  credit_card: "Cartão de crédito",
};

const PIX_ALERT_MESSAGES: Record<string, string> = {
  REFUSED:
    "Atenção! Autorização de PIX Automático recusada pelo banco do cliente. Solicite ao cliente para que autorize novamente, acessando o link de sua fatura.",
  CREATED:
    "Atenção! Autorização de PIX Automático pendente de autorização. Solicite ao cliente para que faça a autorização, acessando o link de sua fatura.",
  CANCELLED:
    "Atenção! Autorização de PIX Automático cancelada pelo banco do cliente. Solicite ao cliente para que autorize novamente, acessando o link de sua fatura.",
};

const CARD_NO_TOKEN_ALERT =
  "Atenção! Essa recorrência não possui cartão salvo. Possivelmente o usuário permitiu o cartão somente no primeiro pagamento ou não concluiu o cadastro do cartão. Solicite ao usuário para acessar o link da fatura e preencher com os dados do cartão de crédito.";

type PaymentConstructorProps = {
  id: string;
  customerName: string;
  customerDocument: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  amount: number;
  status: string;
  origin: string;
  paymentType: string;
  dueDate: string | null;
  paidDate: string | null;
  confirmedDate: string | null;
  notifiedByEmail: boolean;
  notifiedByWhatsApp: boolean;
  notificationsCount: number;
  paymentLink: string;
  alertMessage: string | null;
  subscriptionHasToken: boolean;
  pixAuthorizationStatus: string | null;
  operatorReference: string | null;
};

class Payment {
  readonly id: string;
  readonly customerName: string;
  readonly customerDocument: string | null;
  readonly customerEmail: string | null;
  readonly customerPhone: string | null;
  readonly amount: number;
  readonly status: string;
  readonly origin: string;
  readonly paymentType: string;
  readonly dueDate: string | null;
  readonly paidDate: string | null;
  readonly confirmedDate: string | null;
  readonly notifiedByEmail: boolean;
  readonly notifiedByWhatsApp: boolean;
  readonly notificationsCount: number;
  readonly paymentLink: string;
  readonly alertMessage: string | null;
  readonly subscriptionHasToken: boolean;
  readonly pixAuthorizationStatus: string | null;
  readonly operatorReference: string | null;

  private constructor(props: PaymentConstructorProps) {
    this.id = props.id;
    this.customerName = props.customerName;
    this.customerDocument = props.customerDocument;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.amount = props.amount;
    this.status = props.status;
    this.origin = props.origin;
    this.paymentType = props.paymentType;
    this.dueDate = props.dueDate;
    this.paidDate = props.paidDate;
    this.confirmedDate = props.confirmedDate;
    this.notifiedByEmail = props.notifiedByEmail;
    this.notifiedByWhatsApp = props.notifiedByWhatsApp;
    this.notificationsCount = props.notificationsCount;
    this.paymentLink = props.paymentLink;
    this.alertMessage = props.alertMessage;
    this.subscriptionHasToken = props.subscriptionHasToken;
    this.pixAuthorizationStatus = props.pixAuthorizationStatus;
    this.operatorReference = props.operatorReference;
  }

  static restore(props: PaymentConstructorProps): Payment {
    return new Payment(props);
  }

  private computeAlertMessage(): string | null {
    if (this.paymentType === "automatic_pix" && this.pixAuthorizationStatus) {
      return PIX_ALERT_MESSAGES[this.pixAuthorizationStatus] ?? null;
    }
    if (
      this.paymentType === "credit_card" &&
      (this.status === "awaiting_payment" || this.status === "created") &&
      !this.subscriptionHasToken
    ) {
      return CARD_NO_TOKEN_ALERT;
    }
    return this.alertMessage;
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return {
      id: this.id,
      rawAmount: this.amount,
      customerName: this.customerName,
      customerDocument: FormatAdapter.cpfCnpj(this.customerDocument ?? ""),
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      amount: fmt(this.amount),
      status: STATUS_MAP[this.status] ?? this.status,
      origin: this.origin === "subscription" ? "Recorrente" : "Pontual",
      paymentType: PAYMENT_TYPE_MAP[this.paymentType] ?? this.paymentType,
      dueDate: this.dueDate ?? "—",
      paidDate: this.paidDate?.split(" ")[0] ?? this.confirmedDate ?? null,
      notifiedByEmail: this.notifiedByEmail,
      notifiedByWhatsApp: this.notifiedByWhatsApp,
      notificationsCount: this.notificationsCount,
      paymentLink: this.paymentLink,
      alertMessage: this.computeAlertMessage(),
      subscriptionHasToken: this.subscriptionHasToken,
      pixAuthorizationStatus: this.pixAuthorizationStatus,
      operatorReference: this.operatorReference?.replace(/^pay_/, "") ?? null,
    };
  }
}

export { Payment };
