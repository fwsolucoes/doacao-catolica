import { DeleteWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/deleteWhatsappTemplateButtonUseCase";
import { DeleteWhatsappTemplateButtonController } from "~/infra/controllers/whatsappTemplates/deleteWhatsappTemplateButtonController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const deleteWhatsappTemplateButtonUseCase = new DeleteWhatsappTemplateButtonUseCase(
  whatsappTemplateDal,
);
const deleteWhatsappTemplateButtonController = new DeleteWhatsappTemplateButtonController(
  deleteWhatsappTemplateButtonUseCase,
);

const deleteWhatsappTemplateButton = {
  handle: deleteWhatsappTemplateButtonController.handle.bind(
    deleteWhatsappTemplateButtonController,
  ),
};

export { deleteWhatsappTemplateButton };
