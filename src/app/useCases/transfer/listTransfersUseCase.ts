import { TransferSearchParams } from "~/app/search/transferSearchParams";
import type { TransferGatewayDTO } from "~/domain/gateways/transfer";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class ListTransfersUseCase {
  constructor(private gateway: TransferGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignPublicId, startDate, endDate } = input;

    const searchParams = new TransferSearchParams({
      filter: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    const result = await this.gateway.listTransfers(
      campaignPublicId,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListTransfersUseCase };
