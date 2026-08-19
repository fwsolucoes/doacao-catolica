type PixAuthorizationSummaryProps = {
  active: number;
  awaitingAuthorization: number;
  refused: number;
  cancelled: number;
};

class PixAuthorizationSummary {
  private constructor(private props: PixAuthorizationSummaryProps) {}

  static restore(props: PixAuthorizationSummaryProps): PixAuthorizationSummary {
    return new PixAuthorizationSummary(props);
  }

  toJson() {
    return {
      active: this.props.active,
      awaitingAuthorization: this.props.awaitingAuthorization,
      refused: this.props.refused,
      cancelled: this.props.cancelled,
    };
  }
}

type PixAuthorizationSummaryJson = ReturnType<
  PixAuthorizationSummary["toJson"]
>;

export { PixAuthorizationSummary, type PixAuthorizationSummaryJson };
