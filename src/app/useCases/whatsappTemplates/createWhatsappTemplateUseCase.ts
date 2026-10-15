import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { CreateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplate";

class CreateWhatsappTemplateUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(campaignId: string, data: CreateWhatsappTemplateBody): Promise<void> {
    await this.whatsappTemplateDal.createWhatsappTemplate(campaignId, data);
  }
}

export { CreateWhatsappTemplateUseCase };
