import { ListSuggestedValuesUseCase } from "~/app/useCases/suggestedValue/listSuggestedValuesUseCase";
import { CreateSuggestedValueUseCase } from "~/app/useCases/suggestedValue/createSuggestedValueUseCase";
import { UpdateSuggestedValueUseCase } from "~/app/useCases/suggestedValue/updateSuggestedValueUseCase";
import { DeleteSuggestedValueUseCase } from "~/app/useCases/suggestedValue/deleteSuggestedValueUseCase";
import { SuggestedValueGateway } from "~/infra/gateways/suggestedValue";
import { SuggestedValueController } from "~/infra/controllers/suggestedValue/suggestedValueController";

const gateway = new SuggestedValueGateway();
const controller = new SuggestedValueController(
  new ListSuggestedValuesUseCase(gateway),
  new CreateSuggestedValueUseCase(gateway),
  new UpdateSuggestedValueUseCase(gateway),
  new DeleteSuggestedValueUseCase(gateway),
);

const suggestedValueFactory = {
  handleLoader: controller.handleLoader.bind(controller),
  handleAction: controller.handleAction.bind(controller),
};

export { suggestedValueFactory };
