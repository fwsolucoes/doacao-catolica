import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";

class DeleteWhatsappTemplateButtonUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(templateUuid: string, buttonUuid: string): Promise<void> {
    await this.whatsappTemplateDal.deleteWhatsappTemplateButton(templateUuid, buttonUuid);
  }
}

export { DeleteWhatsappTemplateButtonUseCase };
