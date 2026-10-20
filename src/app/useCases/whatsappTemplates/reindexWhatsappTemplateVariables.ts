import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplateDetailVariable } from "~/domain/views/whatsappTemplateDetail";

async function reindexWhatsappTemplateVariables(
  whatsappTemplateDal: WhatsappTemplateDalDTO,
  campaignId: string,
  templateUuid: string,
  variables: WhatsappTemplateDetailVariable[],
): Promise<void> {
  const outOfOrder = variables
    .map((variable, index) => ({ variable, position: index + 1 }))
    .filter(({ variable, position }) => variable.position !== position);

  if (!outOfOrder.length) return;

  await Promise.all(
    outOfOrder.map(({ variable, position }) =>
      whatsappTemplateDal.updateWhatsappTemplateVariable(
        campaignId,
        templateUuid,
        variable.uuid,
        {
          variable_uuid: variable.uuid,
          system_field: variable.systemField,
          description: variable.description ?? "",
        },
        position,
      ),
    ),
  );
}

export { reindexWhatsappTemplateVariables };
