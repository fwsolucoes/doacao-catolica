import { ListWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase";
import { ListWhatsappTemplatesController } from "~/infra/controllers/whatsappTemplates/listWhatsappTemplatesController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const listWhatsappTemplatesUseCase = new ListWhatsappTemplatesUseCase(whatsappTemplateDal);
const listWhatsappTemplatesController = new ListWhatsappTemplatesController(
  listWhatsappTemplatesUseCase,
);

const listWhatsappTemplates = {
  handle: listWhatsappTemplatesController.handle.bind(listWhatsappTemplatesController),
};

export { listWhatsappTemplates };
