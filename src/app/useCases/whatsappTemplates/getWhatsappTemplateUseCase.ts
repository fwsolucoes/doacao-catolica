import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplateDetail } from "~/domain/views/whatsappTemplateDetail";

class GetWhatsappTemplateUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(campaignId: string, uuid: string): Promise<WhatsappTemplateDetail> {
    return this.whatsappTemplateDal.getWhatsappTemplate(campaignId, uuid);
  }
}

export { GetWhatsappTemplateUseCase };
