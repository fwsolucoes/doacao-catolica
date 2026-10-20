import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { UpdateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableUpdate";

class UpdateWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    campaignId: string,
    templateUuid: string,
    variableUuid: string,
    data: UpdateWhatsappTemplateVariableBody,
  ): Promise<void> {
    const template = await this.whatsappTemplateDal.getWhatsappTemplate(campaignId, templateUuid);
    const index = template.variables.findIndex((v) => v.uuid === variableUuid);
    const position = index >= 0 ? index + 1 : template.variables.length + 1;

    await this.whatsappTemplateDal.updateWhatsappTemplateVariable(
      campaignId,
      templateUuid,
      variableUuid,
      data,
      position,
    );
  }
}

export { UpdateWhatsappTemplateVariableUseCase };
