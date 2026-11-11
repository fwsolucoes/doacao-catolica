import type { RaffleGatewayDTO, RaffleInput } from "~/domain/gateways/raffle";

type InputProps = RaffleInput & {
  accountReference: string;
};

class CreateRaffleUseCase {
  constructor(private gateway: RaffleGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    const { accountReference, ...raffle } = input;
    await this.gateway.createRaffle(accountReference, raffle);
  }
}

export { CreateRaffleUseCase };
