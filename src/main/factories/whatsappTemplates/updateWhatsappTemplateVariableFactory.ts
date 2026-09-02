import { UpdateWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateVariableUseCase";
import { UpdateWhatsappTemplateVariableController } from "~/infra/controllers/whatsappTemplates/updateWhatsappTemplateVariableController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const updateWhatsappTemplateVariableUseCase = new UpdateWhatsappTemplateVariableUseCase(
  whatsappTemplateDal,
);
const updateWhatsappTemplateVariableController = new UpdateWhatsappTemplateVariableController(
  updateWhatsappTemplateVariableUseCase,
);

const updateWhatsappTemplateVariable = {
  handle: updateWhatsappTemplateVariableController.handle.bind(
    updateWhatsappTemplateVariableController,
  ),
};

export { updateWhatsappTemplateVariable };
