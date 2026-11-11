import type { RaffleGatewayDTO, UpdateRaffleInput } from "~/domain/gateways/raffle";

type InputProps = UpdateRaffleInput & {
  raffleId: string;
};

class UpdateRaffleUseCase {
  constructor(private gateway: RaffleGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    const { raffleId, ...raffle } = input;
    await this.gateway.updateRaffle(raffleId, raffle);
  }
}

export { UpdateRaffleUseCase };
