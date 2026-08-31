import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplateDetail } from "~/domain/views/whatsappTemplateDetail";

class GetWhatsappTemplateUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(uuid: string): Promise<WhatsappTemplateDetail> {
    return this.whatsappTemplateDal.getWhatsappTemplate(uuid);
  }
}

export { GetWhatsappTemplateUseCase };
