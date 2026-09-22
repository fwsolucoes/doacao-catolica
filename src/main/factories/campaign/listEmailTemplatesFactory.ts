import { ListEmailTemplatesUseCase } from "~/app/useCases/campaign/listEmailTemplatesUseCase";
import { EmailTemplateDal } from "~/infra/dal/emailTemplate";
import { ListEmailTemplatesController } from "~/infra/controllers/campaign/listEmailTemplatesController";

const emailTemplateDal = new EmailTemplateDal();
const listEmailTemplatesUseCase = new ListEmailTemplatesUseCase(emailTemplateDal);
const listEmailTemplatesController = new ListEmailTemplatesController(
  listEmailTemplatesUseCase,
);

const listEmailTemplates = {
  handle: listEmailTemplatesController.handle.bind(listEmailTemplatesController),
};

export { listEmailTemplates };
