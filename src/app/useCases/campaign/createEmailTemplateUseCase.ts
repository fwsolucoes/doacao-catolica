import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";
import type { CreateEmailTemplateBody } from "~/infra/schemas/internal/emailTemplate";

type InputProps = {
  campaignId: string;
  data: CreateEmailTemplateBody;
};

class CreateEmailTemplateUseCase {
  constructor(private emailTemplateDal: EmailTemplateDalDTO) {}

  async execute(input: InputProps) {
    await this.emailTemplateDal.createEmailTemplate(input.campaignId, input.data);
  }
}

export { CreateEmailTemplateUseCase };
