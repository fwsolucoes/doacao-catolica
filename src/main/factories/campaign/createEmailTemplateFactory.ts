import { CreateEmailTemplateUseCase } from "~/app/useCases/campaign/createEmailTemplateUseCase";
import { EmailTemplateDal } from "~/infra/dal/emailTemplate";
import { CreateEmailTemplateController } from "~/infra/controllers/campaign/createEmailTemplateController";

const emailTemplateDal = new EmailTemplateDal();
const createEmailTemplateUseCase = new CreateEmailTemplateUseCase(emailTemplateDal);
const createEmailTemplateController = new CreateEmailTemplateController(
  createEmailTemplateUseCase,
);

const createEmailTemplate = {
  handle: createEmailTemplateController.handle.bind(createEmailTemplateController),
};

export { createEmailTemplate };
