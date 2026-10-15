import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplateUpdate";

class UpdateWhatsappTemplateUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    campaignId: string,
    uuid: string,
    data: UpdateWhatsappTemplateBody,
  ): Promise<void> {
    await this.whatsappTemplateDal.updateWhatsappTemplate(campaignId, uuid, data);
  }
}

export { UpdateWhatsappTemplateUseCase };
