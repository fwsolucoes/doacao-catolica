import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateHeaderBody } from "~/infra/schemas/internal/whatsappTemplateHeaderUpdate";

class UpdateWhatsappTemplateHeaderUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    templateUuid: string,
    headerUuid: string,
    data: UpdateWhatsappTemplateHeaderBody,
  ): Promise<void> {
    await this.whatsappTemplateDal.updateWhatsappTemplateHeader(templateUuid, headerUuid, data);
  }
}

export { UpdateWhatsappTemplateHeaderUseCase };
