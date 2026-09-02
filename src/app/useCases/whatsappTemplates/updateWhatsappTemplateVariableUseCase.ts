import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableUpdate";

class UpdateWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    templateUuid: string,
    variableUuid: string,
    data: UpdateWhatsappTemplateVariableBody,
  ): Promise<void> {
    await this.whatsappTemplateDal.updateWhatsappTemplateVariable(
      templateUuid,
      variableUuid,
      data,
    );
  }
}

export { UpdateWhatsappTemplateVariableUseCase };
