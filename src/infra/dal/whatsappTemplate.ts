import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import { WhatsappTemplate } from "~/domain/views/whatsappTemplate";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import type { CreateWhatsappTemplateBody } from "../schemas/internal/whatsappTemplate";
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

  async createWhatsappTemplate(
    data: CreateWhatsappTemplateBody,
  ): Promise<void> {
    const header = this.buildHeader(data);
    const variables = this.buildVariables(data.variables);
    const buttons = this.buildButtons(data.button);

    const body: Record<string, unknown> = {
      template_name: data.template_name,
      template_language: data.template_language,
      template_type: data.template_type,
      notification_type: data.notification_type,
    };

    if (data.template_preview_text)
      body.template_preview_text = data.template_preview_text;
    if (data.template_preview_image)
      body.template_preview_image = data.template_preview_image;
    if (header !== undefined) body.header = header;
    if (variables.length) body.variables = variables;
    if (buttons.length) body.buttons = buttons;

    const apiResponse = await donationApi.post(
      "/api/client_whatsapp_templates",
      {
        body,
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  private buildHeader(
    data: CreateWhatsappTemplateBody,
  ): Record<string, unknown> | null | undefined {
    const type = data.header_type;
    if (!type || type === "none") return null;
    if (type === "text") return { type: "text", text: data.header_text };
    if (type === "image") return { type: "image", link: data.header_image };
    if (type === "video") return { type: "video", link: data.header_link };
    if (type === "document")
      return { type: "document", link: data.header_document };
    return undefined;
  }

  private buildVariables(variables: CreateWhatsappTemplateBody["variables"]) {
    return variables.map((v) => {
      if (v.varType === "dynamic") {
        const dotIndex = v.systemField.indexOf(".");
        const table = v.systemField.slice(0, dotIndex);
        const field = v.systemField.slice(dotIndex + 1);
        return { name: field, table, field, description: v.description };
      }
      return {
        name: v.fixedValue,
        table: null,
        field: v.fixedValue,
        description: v.description,
      };
    });
  }

  private buildButtons(button: CreateWhatsappTemplateBody["button"]) {
    if (!button) return [];
    return [{ sub_type: button.subType, button_index: 0, value: button.value }];
  }
}

export { WhatsappTemplateDal };
