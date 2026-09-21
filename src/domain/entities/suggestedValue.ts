type SuggestedValueProps = {
  id: string;
  description: string;
  amount: number;
};

class SuggestedValue {
  private constructor(private props: SuggestedValueProps) {}

  static restore(props: SuggestedValueProps): SuggestedValue {
    return new SuggestedValue(props);
  }

  toJson() {
    return {
      id: this.props.id,
      description: this.props.description,
      amount: this.props.amount,
    };
  }
}

export { SuggestedValue };
