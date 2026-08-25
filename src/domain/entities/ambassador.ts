type AmbassadorProps = {
  id: string;
  projectId: string;
  rank: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  code: string;
  createdAt: string;
  periodIndications: number;
  totalIndications: number;
  totalRecurringAmount: number;
  totalRaisedAmount: number;
  totalPaidPayments: number;
};

class Ambassador {
  private constructor(private props: AmbassadorProps) {}

  static restore(props: AmbassadorProps) {
    return new Ambassador(props);
  }

  private formatCreatedAt(): string {
    const datePart = this.props.createdAt.split(" ")[0];
    if (!datePart) return this.props.createdAt;
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return this.props.createdAt;
    return `${day}/${month}/${year}`;
  }

  private formatPhone(): string | null {
    if (!this.props.phone) return null;
    const digits = this.props.phone.replace(/\D/g, "");
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return this.props.phone;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  toJson() {
    return {
      id: this.props.id,
      projectId: this.props.projectId,
      rank: this.props.rank,
      name: this.props.name,
      email: this.props.email,
      phone: this.formatPhone(),
      status: this.props.status,
      code: this.props.code,
      createdAt: this.formatCreatedAt(),
      periodIndications: this.props.periodIndications,
      totalIndications: this.props.totalIndications,
      totalRecurringAmount: this.formatCurrency(this.props.totalRecurringAmount),
      totalRaisedAmount: this.formatCurrency(this.props.totalRaisedAmount),
      totalPaidPayments: this.props.totalPaidPayments,
    };
  }
}

type AmbassadorJson = ReturnType<Ambassador["toJson"]>;

export { Ambassador, type AmbassadorJson, type AmbassadorProps };
