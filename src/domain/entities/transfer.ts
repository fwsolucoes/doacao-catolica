function toBrazilianDate(dateStr: string): string {
  if (!dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

type TransferProps = {
  id: string;
  status: string;
  type: string;
  // raw datetime string from the API, e.g. "23/07/2026 10:00:00", or null
  paidDate: string | null;
  amount: number;
  transactionReceiptUrl: string | null;
  // raw datetime string from the API, e.g. "23/07/2026 10:00:00"
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

class Transfer {
  readonly id: string;
  readonly status: string;
  readonly type: string;
  readonly paidDate: string | null;
  readonly amount: number;
  readonly transactionReceiptUrl: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;

  private constructor(props: TransferProps) {
    this.id = props.id;
    this.status = props.status;
    this.type = props.type;
    this.paidDate = props.paidDate;
    this.amount = props.amount;
    this.transactionReceiptUrl = props.transactionReceiptUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  static restore(props: TransferProps): Transfer {
    return new Transfer(props);
  }

  toJson() {
    const [createdAt] = this.createdAt.split(" ");
    const [rawPaidDate] = this.paidDate?.split(" ") ?? [null];
    return {
      id: this.id,
      status: this.status,
      type: this.type,
      paidDate: rawPaidDate ? toBrazilianDate(rawPaidDate) : null,
      amount: this.amount,
      transactionReceiptUrl: this.transactionReceiptUrl,
      createdAt: createdAt ?? "",
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

export { Transfer };
export type { TransferProps };
