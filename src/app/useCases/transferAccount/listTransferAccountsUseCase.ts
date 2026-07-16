import type { TransferAccountGatewayDTO } from "~/domain/gateways/transferAccount";

type InputProps = {
  accountId: number;
};

class ListTransferAccountsUseCase {
  constructor(private gateway: TransferAccountGatewayDTO) {}

  async execute(input: InputProps, token: string) {
    const result = await this.gateway.listTransferAccounts(
      input.accountId,
      token,
    );

    return result.toJson();
  }
}

export { ListTransferAccountsUseCase };
