import { ListPixAuthorizationsUseCase } from "~/app/useCases/pixAuthorizationList/listPixAuthorizationsUseCase";
import { ListPixAuthorizationsController } from "~/infra/controllers/pixAuthorizationList/listPixAuthorizationsController";
import { PixAuthorizationListGateway } from "~/infra/gateways/pixAuthorizationList";

const pixAuthorizationListGateway = new PixAuthorizationListGateway();
const listPixAuthorizationsUseCase = new ListPixAuthorizationsUseCase(
  pixAuthorizationListGateway,
);
const listPixAuthorizationsController = new ListPixAuthorizationsController(
  listPixAuthorizationsUseCase,
);

const listPixAuthorizations = {
  handle: listPixAuthorizationsController.handle.bind(
    listPixAuthorizationsController,
  ),
};

export { listPixAuthorizations };
