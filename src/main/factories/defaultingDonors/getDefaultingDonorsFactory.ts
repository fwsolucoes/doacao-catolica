import { GetDefaultingDonorsUseCase } from "~/app/useCases/defaultingDonors/getDefaultingDonorsUseCase";
import { DefaultingDonorsGateway } from "~/infra/gateways/defaultingDonors";

const gateway = new DefaultingDonorsGateway();
const useCase = new GetDefaultingDonorsUseCase(gateway);

const getDefaultingDonors = {
  handle: (accountUuid: string, months: number) =>
    useCase.execute({ accountUuid, months }),
};

export { getDefaultingDonors };
