import { ListSubAccountsUseCase } from "~/app/useCases/subAccount/listSubAccountsUseCase";
import { ListSubAccountsController } from "~/infra/controllers/subAccount/listSubAccountsController";
import { SubAccountGateway } from "~/infra/gateways/subAccount";

const subAccountGateway = new SubAccountGateway();
const listSubAccountsUseCase = new ListSubAccountsUseCase(subAccountGateway);
const listSubAccountsController = new ListSubAccountsController(
  listSubAccountsUseCase,
);

const listSubAccounts = {
  handle: listSubAccountsController.handle.bind(listSubAccountsController),
};

export { listSubAccounts };
