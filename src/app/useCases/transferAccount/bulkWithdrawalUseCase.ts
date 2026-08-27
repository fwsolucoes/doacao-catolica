import type { TransferAccountGatewayDTO } from "~/domain/gateways/transferAccount";

type InputProps = {
  referenceId: string;
  pix: {
    key: string;
    type: string;
    scheduleDate: string;
  };
};

class BulkWithdrawalUseCase {
  constructor(private gateway: TransferAccountGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    await this.gateway.bulkWithdrawal(input);
  }
}

export { BulkWithdrawalUseCase };
