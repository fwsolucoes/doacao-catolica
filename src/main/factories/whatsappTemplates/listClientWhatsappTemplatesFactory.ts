import { ListClientWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listClientWhatsappTemplatesUseCase";
import { ListClientWhatsappTemplatesController } from "~/infra/controllers/whatsappTemplates/listClientWhatsappTemplatesController";
import { WhatsappTemplateDal } from "~/infra/dal/whatsappTemplate";

const whatsappTemplateDal = new WhatsappTemplateDal();
const listClientWhatsappTemplatesUseCase = new ListClientWhatsappTemplatesUseCase(
  whatsappTemplateDal,
);
const listClientWhatsappTemplatesController = new ListClientWhatsappTemplatesController(
  listClientWhatsappTemplatesUseCase,
);

const listClientWhatsappTemplates = {
  handle: listClientWhatsappTemplatesController.handle.bind(
    listClientWhatsappTemplatesController,
  ),
};

export { listClientWhatsappTemplates };
