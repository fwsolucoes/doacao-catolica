import { DeleteWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/deleteWhatsappTemplateVariableUseCase";
import { DeleteWhatsappTemplateVariableController } from "~/infra/controllers/whatsappTemplates/deleteWhatsappTemplateVariableController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const deleteWhatsappTemplateVariableUseCase = new DeleteWhatsappTemplateVariableUseCase(
  whatsappTemplateDal,
);
const deleteWhatsappTemplateVariableController = new DeleteWhatsappTemplateVariableController(
  deleteWhatsappTemplateVariableUseCase,
);

const deleteWhatsappTemplateVariable = {
  handle: deleteWhatsappTemplateVariableController.handle.bind(
    deleteWhatsappTemplateVariableController,
  ),
};

export { deleteWhatsappTemplateVariable };
