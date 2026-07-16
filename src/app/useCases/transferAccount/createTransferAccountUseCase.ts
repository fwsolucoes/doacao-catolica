import type { TransferAccountGatewayDTO } from "~/domain/gateways/transferAccount";

type InputProps = {
  accountId: number;
  pixType: string;
  pixKey: string;
  type: number;
};

class CreateTransferAccountUseCase {
  constructor(private gateway: TransferAccountGatewayDTO) {}

  async execute(input: InputProps, token: string): Promise<void> {
    await this.gateway.createTransferAccount({
      ...input,
      token,
    });
  }
}

export { CreateTransferAccountUseCase };
