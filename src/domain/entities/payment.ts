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

type PaymentConstructorProps = {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  origin: string;
  paymentType: string;
  dueDate: string | null;
  paidDate: string | null;
  confirmedDate: string | null;
  notifiedByEmail: boolean;
  notifiedByWhatsApp: boolean;
};

class Payment {
  readonly id: string;
  readonly customerName: string;
  readonly amount: number;
  readonly status: string;
  readonly origin: string;
  readonly paymentType: string;
  readonly dueDate: string | null;
  readonly paidDate: string | null;
  readonly confirmedDate: string | null;
  readonly notifiedByEmail: boolean;
  readonly notifiedByWhatsApp: boolean;

  private constructor(props: PaymentConstructorProps) {
    this.id = props.id;
    this.customerName = props.customerName;
    this.amount = props.amount;
    this.status = props.status;
    this.origin = props.origin;
    this.paymentType = props.paymentType;
    this.dueDate = props.dueDate;
    this.paidDate = props.paidDate;
    this.confirmedDate = props.confirmedDate;
    this.notifiedByEmail = props.notifiedByEmail;
    this.notifiedByWhatsApp = props.notifiedByWhatsApp;
  }

  static restore(props: PaymentConstructorProps): Payment {
    return new Payment(props);
  }

  toJson() {
    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return {
      id: this.id,
      customerName: this.customerName,
      amount: fmt(this.amount),
      status: STATUS_MAP[this.status] ?? this.status,
      origin: this.origin === "subscription" ? "Recorrente" : "Pontual",
      paymentType: PAYMENT_TYPE_MAP[this.paymentType] ?? this.paymentType,
      dueDate: this.dueDate ?? "—",
      paidDate: this.paidDate ?? this.confirmedDate ?? null,
      notifiedByEmail: this.notifiedByEmail,
      notifiedByWhatsApp: this.notifiedByWhatsApp,
    };
  }
}

export { Payment };
