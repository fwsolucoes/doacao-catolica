import type {
  TransferGatewayDTO,
  TransferMetricsData,
} from "~/domain/gateways/transfer";

type InputProps = {
  campaignPublicId: string;
};

class GetTransferMetricsUseCase {
  constructor(private gateway: TransferGatewayDTO) {}

  async execute(input: InputProps): Promise<TransferMetricsData> {
    return this.gateway.getTransferMetrics(input.campaignPublicId);
  }
}

export { GetTransferMetricsUseCase };
