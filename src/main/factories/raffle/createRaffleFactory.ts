import { CreateRaffleUseCase } from "~/app/useCases/raffle/createRaffleUseCase";
import { CreateRaffleController } from "~/infra/controllers/raffle/createRaffleController";
import { RaffleGateway } from "~/infra/gateways/raffle";

const raffleGateway = new RaffleGateway();
const createRaffleUseCase = new CreateRaffleUseCase(raffleGateway);
const createRaffleController = new CreateRaffleController(createRaffleUseCase);

const createRaffle = {
  handle: createRaffleController.handle.bind(createRaffleController),
};

export { createRaffle };
