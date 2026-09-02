import { CreateWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateVariableUseCase";
import { CreateWhatsappTemplateVariableController } from "~/infra/controllers/whatsappTemplates/createWhatsappTemplateVariableController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const createWhatsappTemplateVariableUseCase = new CreateWhatsappTemplateVariableUseCase(
  whatsappTemplateDal,
);
const createWhatsappTemplateVariableController = new CreateWhatsappTemplateVariableController(
  createWhatsappTemplateVariableUseCase,
);

const createWhatsappTemplateVariable = {
  handle: createWhatsappTemplateVariableController.handle.bind(
    createWhatsappTemplateVariableController,
  ),
};

export { createWhatsappTemplateVariable };
