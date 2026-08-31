import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplateUpdate";

class UpdateWhatsappTemplateUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(uuid: string, data: UpdateWhatsappTemplateBody): Promise<void> {
    await this.whatsappTemplateDal.updateWhatsappTemplate(uuid, data);
  }
}

export { UpdateWhatsappTemplateUseCase };
