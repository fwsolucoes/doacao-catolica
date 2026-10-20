import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";

class DeleteWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(campaignId: string, templateUuid: string, variableUuid: string): Promise<void> {
    await this.whatsappTemplateDal.deleteWhatsappTemplateVariable(
      campaignId,
      templateUuid,
      variableUuid,
    );
  }
}

export { DeleteWhatsappTemplateVariableUseCase };
