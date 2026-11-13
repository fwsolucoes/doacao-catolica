import { UpdateRaffleUseCase } from "~/app/useCases/raffle/updateRaffleUseCase";
import { UpdateRaffleController } from "~/infra/controllers/raffle/updateRaffleController";
import { RaffleGateway } from "~/infra/gateways/raffle";

const raffleGateway = new RaffleGateway();
const updateRaffleUseCase = new UpdateRaffleUseCase(raffleGateway);
const updateRaffleController = new UpdateRaffleController(updateRaffleUseCase);

const updateRaffle = {
  handle: updateRaffleController.handle.bind(updateRaffleController),
};

export { updateRaffle };
