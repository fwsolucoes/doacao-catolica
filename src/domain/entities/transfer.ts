type TransferProps = {
  id: string;
  status: string;
  type: string;
  paidDate: string | null;
  amount: number;
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
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;

  private constructor(props: TransferProps) {
    this.id = props.id;
    this.status = props.status;
    this.type = props.type;
    this.paidDate = props.paidDate;
    this.amount = props.amount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  static restore(props: TransferProps): Transfer {
    return new Transfer(props);
  }

  toJson() {
    return {
      id: this.id,
      status: this.status,
      type: this.type,
      paidDate: this.paidDate,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

export { Transfer };
export type { TransferProps };
