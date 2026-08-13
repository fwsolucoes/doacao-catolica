import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import { WhatsappTemplate } from "~/domain/views/whatsappTemplate";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { listWhatsappTemplatesSchema } from "../schemas/external/whatsappTemplates";

class WhatsappTemplateDal implements WhatsappTemplateDalDTO {
  async listWhatsappTemplates(
    notificationType?: string,
  ): Promise<WhatsappTemplate[]> {
    const params = new URLSearchParams();
    if (notificationType) params.set("notification_type", notificationType);
    const query = params.toString();
    const url = query
      ? `/api/client_whatsapp_templates?${query}`
      : `/api/client_whatsapp_templates`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(
      listWhatsappTemplatesSchema,
    ).validate(apiResponse.response);

    return (validated.data ?? []).map((item) =>
      WhatsappTemplate.restore({
        uuid: item.uuid,
        templateName: item.template_name,
        templateLanguage: item.template_language ?? "",
        templateType: item.template_type,
        notificationType: item.notification_type,
        templatePreviewText: item.template_preview_text ?? "",
        headerType: item.header?.type ?? null,
        variablesCount: (item.variables ?? []).length,
        buttonsCount: (item.buttons ?? []).length,
      }),
    );
  }
}

export { WhatsappTemplateDal };
