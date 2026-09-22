import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";

type InputProps = {
  campaignId: string;
};

class ListEmailTemplatesUseCase {
  constructor(private emailTemplateDal: EmailTemplateDalDTO) {}

  async execute(input: InputProps) {
    const templates = await this.emailTemplateDal.listEmailTemplates(
      input.campaignId,
    );
    return templates.map((t) => t.toJson());
  }
}

export { ListEmailTemplatesUseCase };
