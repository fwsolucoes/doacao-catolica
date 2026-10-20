import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";

class DeleteWhatsappTemplateButtonUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(campaignId: string, templateUuid: string, buttonUuid: string): Promise<void> {
    await this.whatsappTemplateDal.deleteWhatsappTemplateButton(
      campaignId,
      templateUuid,
      buttonUuid,
    );
  }
}

export { DeleteWhatsappTemplateButtonUseCase };
