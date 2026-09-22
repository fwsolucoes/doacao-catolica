import { DeleteEmailTemplateUseCase } from "~/app/useCases/campaign/deleteEmailTemplateUseCase";
import { EmailTemplateDal } from "~/infra/dal/emailTemplate";
import { DeleteEmailTemplateController } from "~/infra/controllers/campaign/deleteEmailTemplateController";

const emailTemplateDal = new EmailTemplateDal();
const deleteEmailTemplateUseCase = new DeleteEmailTemplateUseCase(emailTemplateDal);
const deleteEmailTemplateController = new DeleteEmailTemplateController(
  deleteEmailTemplateUseCase,
);

const deleteEmailTemplate = {
  handle: deleteEmailTemplateController.handle.bind(deleteEmailTemplateController),
};

export { deleteEmailTemplate };
