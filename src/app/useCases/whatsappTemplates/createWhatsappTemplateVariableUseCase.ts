import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { CreateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableCreate";

class CreateWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(templateUuid: string, data: CreateWhatsappTemplateVariableBody): Promise<void> {
    await this.whatsappTemplateDal.createWhatsappTemplateVariable(templateUuid, data);
  }
}

export { CreateWhatsappTemplateVariableUseCase };
