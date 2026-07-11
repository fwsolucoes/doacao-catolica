type PaymentMethodProps = {
  id: string;
  name: string;
};

class PaymentMethod {
  id: string;
  name: string;

  private constructor(props: PaymentMethodProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static restore(props: PaymentMethodProps): PaymentMethod {
    return new PaymentMethod(props);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export { PaymentMethod };
