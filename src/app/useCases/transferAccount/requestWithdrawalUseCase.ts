import type { TransferAccountGatewayDTO } from "~/domain/gateways/transferAccount";

type InputProps = {
  accountUuid: string;
  amount: number;
  pix: {
    key: string;
    type: string;
    scheduleDate: string;
  };
};

class RequestWithdrawalUseCase {
  constructor(private gateway: TransferAccountGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    await this.gateway.requestWithdrawal(input);
  }
}

export { RequestWithdrawalUseCase };
