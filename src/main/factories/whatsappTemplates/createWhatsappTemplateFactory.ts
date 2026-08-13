import { CreateWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateUseCase";
import { CreateWhatsappTemplateController } from "~/infra/controllers/whatsappTemplates/createWhatsappTemplateController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const createWhatsappTemplateUseCase = new CreateWhatsappTemplateUseCase(whatsappTemplateDal);
const createWhatsappTemplateController = new CreateWhatsappTemplateController(
  createWhatsappTemplateUseCase,
);

const createWhatsappTemplate = {
  handle: createWhatsappTemplateController.handle.bind(createWhatsappTemplateController),
};

export { createWhatsappTemplate };
