import { UpdateWhatsappTemplateHeaderUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateHeaderUseCase";
import { UpdateWhatsappTemplateHeaderController } from "~/infra/controllers/whatsappTemplates/updateWhatsappTemplateHeaderController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const updateWhatsappTemplateHeaderUseCase = new UpdateWhatsappTemplateHeaderUseCase(
  whatsappTemplateDal,
);
const updateWhatsappTemplateHeaderController = new UpdateWhatsappTemplateHeaderController(
  updateWhatsappTemplateHeaderUseCase,
);

const updateWhatsappTemplateHeader = {
  handle: updateWhatsappTemplateHeaderController.handle.bind(
    updateWhatsappTemplateHeaderController,
  ),
};

export { updateWhatsappTemplateHeader };
