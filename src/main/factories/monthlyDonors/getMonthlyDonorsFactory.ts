import { GetMonthlyDonorsUseCase } from "~/app/useCases/monthlyDonors/getMonthlyDonorsUseCase";
import { GetMonthlyDonorsController } from "~/infra/controllers/monthlyDonors/getMonthlyDonorsController";
import { MonthlyDonorsGateway } from "~/infra/gateways/monthlyDonors";

const gateway = new MonthlyDonorsGateway();
const useCase = new GetMonthlyDonorsUseCase(gateway);
const controller = new GetMonthlyDonorsController(useCase);

const getMonthlyDonors = {
  handle: controller.handle.bind(controller),
};

export { getMonthlyDonors };
