import { ListRaffleTicketsUseCase } from "~/app/useCases/raffle/listRaffleTicketsUseCase";
import { ListRaffleTicketsController } from "~/infra/controllers/raffle/listRaffleTicketsController";
import { RaffleGateway } from "~/infra/gateways/raffle";

const raffleGateway = new RaffleGateway();
const listRaffleTicketsUseCase = new ListRaffleTicketsUseCase(raffleGateway);
const listRaffleTicketsController = new ListRaffleTicketsController(
  listRaffleTicketsUseCase,
);

const listRaffleTickets = {
  handle: listRaffleTicketsController.handle.bind(listRaffleTicketsController),
};

export { listRaffleTickets };
