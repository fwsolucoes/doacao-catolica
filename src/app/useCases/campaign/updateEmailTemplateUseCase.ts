import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";
import type { UpdateEmailTemplateBody } from "~/infra/schemas/internal/emailTemplate";

type InputProps = {
  campaignId: string;
  data: UpdateEmailTemplateBody;
};

class UpdateEmailTemplateUseCase {
  constructor(private emailTemplateDal: EmailTemplateDalDTO) {}

  async execute(input: InputProps) {
    await this.emailTemplateDal.updateEmailTemplate(input.campaignId, input.data);
  }
}

export { UpdateEmailTemplateUseCase };
