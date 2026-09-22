import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";

type InputProps = {
  campaignId: string;
  type: string;
};

class DeleteEmailTemplateUseCase {
  constructor(private emailTemplateDal: EmailTemplateDalDTO) {}

  async execute(input: InputProps) {
    await this.emailTemplateDal.deleteEmailTemplate(input.campaignId, input.type);
  }
}

export { DeleteEmailTemplateUseCase };
