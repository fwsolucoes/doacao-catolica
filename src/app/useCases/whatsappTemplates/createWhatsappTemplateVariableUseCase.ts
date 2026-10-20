import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { CreateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableCreate";
import { reindexWhatsappTemplateVariables } from "./reindexWhatsappTemplateVariables";

class CreateWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(
    campaignId: string,
    templateUuid: string,
    data: CreateWhatsappTemplateVariableBody,
  ): Promise<void> {
    const template = await this.whatsappTemplateDal.getWhatsappTemplate(campaignId, templateUuid);

    await reindexWhatsappTemplateVariables(
      this.whatsappTemplateDal,
      campaignId,
      templateUuid,
      template.variables,
    );

    const position = template.variables.length + 1;

    await this.whatsappTemplateDal.createWhatsappTemplateVariable(
      campaignId,
      templateUuid,
      data,
      position,
    );
  }
}

export { CreateWhatsappTemplateVariableUseCase };
