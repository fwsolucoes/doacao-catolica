import { GetDefaultingDonorsUseCase } from "~/app/useCases/defaultingDonors/getDefaultingDonorsUseCase";
import { DefaultingDonorsGateway } from "~/infra/gateways/defaultingDonors";

const gateway = new DefaultingDonorsGateway();
const useCase = new GetDefaultingDonorsUseCase(gateway);

const getDefaultingDonors = {
  handle: (accountUuid: string | undefined, months: number, reference2?: string) =>
    useCase.execute({ accountUuid, months, reference2 }),
};

export { getDefaultingDonors };
