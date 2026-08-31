import { GetWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/getWhatsappTemplateUseCase";
import { GetWhatsappTemplateController } from "~/infra/controllers/whatsappTemplates/getWhatsappTemplateController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const getWhatsappTemplateUseCase = new GetWhatsappTemplateUseCase(whatsappTemplateDal);
const getWhatsappTemplateController = new GetWhatsappTemplateController(
  getWhatsappTemplateUseCase,
);

const getWhatsappTemplate = {
  handle: getWhatsappTemplateController.handle.bind(getWhatsappTemplateController),
};

export { getWhatsappTemplate };
