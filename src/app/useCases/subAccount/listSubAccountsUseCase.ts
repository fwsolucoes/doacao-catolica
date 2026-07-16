import type { SubAccountGatewayDTO } from "~/domain/gateways/subAccount";

type InputProps = {
  accountId: number;
};

class ListSubAccountsUseCase {
  constructor(private gateway: SubAccountGatewayDTO) {}

  async execute(input: InputProps, token: string) {
    const result = await this.gateway.listSubAccounts(input.accountId, token);

    return result.toJson();
  }
}

export { ListSubAccountsUseCase };
