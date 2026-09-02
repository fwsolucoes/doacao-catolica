import { UpdateWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateButtonUseCase";
import { UpdateWhatsappTemplateButtonController } from "~/infra/controllers/whatsappTemplates/updateWhatsappTemplateButtonController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const updateWhatsappTemplateButtonUseCase = new UpdateWhatsappTemplateButtonUseCase(
  whatsappTemplateDal,
);
const updateWhatsappTemplateButtonController = new UpdateWhatsappTemplateButtonController(
  updateWhatsappTemplateButtonUseCase,
);

const updateWhatsappTemplateButton = {
  handle: updateWhatsappTemplateButtonController.handle.bind(
    updateWhatsappTemplateButtonController,
  ),
};

export { updateWhatsappTemplateButton };
