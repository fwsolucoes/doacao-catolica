import { CreateWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateButtonUseCase";
import { CreateWhatsappTemplateButtonController } from "~/infra/controllers/whatsappTemplates/createWhatsappTemplateButtonController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const createWhatsappTemplateButtonUseCase = new CreateWhatsappTemplateButtonUseCase(
  whatsappTemplateDal,
);
const createWhatsappTemplateButtonController = new CreateWhatsappTemplateButtonController(
  createWhatsappTemplateButtonUseCase,
);

const createWhatsappTemplateButton = {
  handle: createWhatsappTemplateButtonController.handle.bind(
    createWhatsappTemplateButtonController,
  ),
};

export { createWhatsappTemplateButton };
