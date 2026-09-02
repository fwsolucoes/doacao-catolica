import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { CreateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonCreate";

class CreateWhatsappTemplateButtonUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(templateUuid: string, data: CreateWhatsappTemplateButtonBody): Promise<void> {
    await this.whatsappTemplateDal.createWhatsappTemplateButton(templateUuid, data);
  }
}

export { CreateWhatsappTemplateButtonUseCase };
