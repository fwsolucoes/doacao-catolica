import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";

class DeleteWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(templateUuid: string, variableUuid: string): Promise<void> {
    await this.whatsappTemplateDal.deleteWhatsappTemplateVariable(templateUuid, variableUuid);
  }
}

export { DeleteWhatsappTemplateVariableUseCase };
