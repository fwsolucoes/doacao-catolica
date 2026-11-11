import { ListRafflesUseCase } from "~/app/useCases/raffle/listRafflesUseCase";
import { ListRafflesController } from "~/infra/controllers/raffle/listRafflesController";
import { RaffleGateway } from "~/infra/gateways/raffle";

const raffleGateway = new RaffleGateway();
const listRafflesUseCase = new ListRafflesUseCase(raffleGateway);
const listRafflesController = new ListRafflesController(listRafflesUseCase);

const listRaffles = {
  handle: listRafflesController.handle.bind(listRafflesController),
};

export { listRaffles };
