import { UpdateWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateUseCase";
import { UpdateWhatsappTemplateController } from "~/infra/controllers/whatsappTemplates/updateWhatsappTemplateController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const updateWhatsappTemplateUseCase = new UpdateWhatsappTemplateUseCase(whatsappTemplateDal);
const updateWhatsappTemplateController = new UpdateWhatsappTemplateController(
  updateWhatsappTemplateUseCase,
);

const updateWhatsappTemplate = {
  handle: updateWhatsappTemplateController.handle.bind(updateWhatsappTemplateController),
};

export { updateWhatsappTemplate };
