import { UpdateEmailTemplateUseCase } from "~/app/useCases/campaign/updateEmailTemplateUseCase";
import { EmailTemplateDal } from "~/infra/dal/emailTemplate";
import { UpdateEmailTemplateController } from "~/infra/controllers/campaign/updateEmailTemplateController";

const emailTemplateDal = new EmailTemplateDal();
const updateEmailTemplateUseCase = new UpdateEmailTemplateUseCase(emailTemplateDal);
const updateEmailTemplateController = new UpdateEmailTemplateController(
  updateEmailTemplateUseCase,
);

const updateEmailTemplate = {
  handle: updateEmailTemplateController.handle.bind(updateEmailTemplateController),
};

export { updateEmailTemplate };
