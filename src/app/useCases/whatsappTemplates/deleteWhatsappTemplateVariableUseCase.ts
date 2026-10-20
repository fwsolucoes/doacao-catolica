import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import { reindexWhatsappTemplateVariables } from "./reindexWhatsappTemplateVariables";

class DeleteWhatsappTemplateVariableUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(campaignId: string, templateUuid: string, variableUuid: string): Promise<void> {
    await this.whatsappTemplateDal.deleteWhatsappTemplateVariable(
      campaignId,
      templateUuid,
      variableUuid,
    );

    const template = await this.whatsappTemplateDal.getWhatsappTemplate(campaignId, templateUuid);

    await reindexWhatsappTemplateVariables(
      this.whatsappTemplateDal,
      campaignId,
      templateUuid,
      template.variables,
    );
  }
}

export { DeleteWhatsappTemplateVariableUseCase };
