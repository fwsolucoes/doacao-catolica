import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonUpdate";

class UpdateWhatsappTemplateButtonUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    templateUuid: string,
    buttonUuid: string,
    data: UpdateWhatsappTemplateButtonBody,
  ): Promise<void> {
    await this.whatsappTemplateDal.updateWhatsappTemplateButton(templateUuid, buttonUuid, data);
  }
}

export { UpdateWhatsappTemplateButtonUseCase };
