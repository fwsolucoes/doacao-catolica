import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import { WhatsappTemplate } from "~/domain/views/whatsappTemplate";
import { WhatsappTemplateDetail } from "~/domain/views/whatsappTemplateDetail";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import type { CreateWhatsappTemplateBody } from "../schemas/internal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "../schemas/internal/whatsappTemplateUpdate";
import type { CreateWhatsappTemplateVariableBody } from "../schemas/internal/whatsappTemplateVariableCreate";
import type { UpdateWhatsappTemplateVariableBody } from "../schemas/internal/whatsappTemplateVariableUpdate";
import { listWhatsappTemplatesSchema } from "../schemas/external/whatsappTemplates";
import { whatsappTemplateDetailResponseSchema } from "../schemas/external/whatsappTemplateDetail";

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

  private buildHeader(data: {
    header_type: string;
    header_text: string;
    header_image: string;
    header_link: string;
    header_document: string;
  }): Record<string, unknown> | null | undefined {
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
      const dotIndex = v.systemField.indexOf(".");
      const table = v.systemField.slice(0, dotIndex);
      const field = v.systemField.slice(dotIndex + 1);
      return { name: field, table, field, description: v.description };
    });
  }

  private buildButtons(button: CreateWhatsappTemplateBody["button"]) {
    if (!button) return [];
    return [{ sub_type: button.subType, button_index: 0, value: button.value }];
  }

  async getWhatsappTemplate(uuid: string): Promise<WhatsappTemplateDetail> {
    const apiResponse = await donationApi.get(
      `/api/client_whatsapp_templates/${uuid}`,
      {
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    console.log("🚀~~apiResponse", apiResponse.response.data);
    console.log("🚀~~apiResponse", apiResponse.response.data.variables);

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(
      whatsappTemplateDetailResponseSchema,
    ).validate(apiResponse.response);

    const item = validated.data;
    const firstButton = (item.buttons ?? [])[0] ?? null;

    return WhatsappTemplateDetail.restore({
      uuid: item.uuid,
      templateName: item.template_name,
      templateLanguage: item.template_language ?? "",
      templateType: item.template_type,
      notificationType: item.notification_type,
      templatePreviewText: item.template_preview_text ?? "",
      templatePreviewImage: item.template_preview_image ?? "",
      headerType: item.header?.type ?? "none",
      headerText: item.header?.text ?? "",
      headerLink: item.header?.link ?? "",
      variables: (item.variables ?? []).map((v) => ({
        uuid: v.uuid,
        systemField: v.table && v.field ? `${v.table}.${v.field}` : "",
        name: v.name ?? null,
        description: v.description ?? null,
      })),
      button: firstButton
        ? {
            uuid: firstButton.uuid,
            subType: firstButton.sub_type,
            value: firstButton.value ?? "",
          }
        : null,
    });
  }

  async updateWhatsappTemplate(
    uuid: string,
    data: UpdateWhatsappTemplateBody,
  ): Promise<void> {
    const header = this.buildHeader(data);
    const variables = this.buildVariables(data.variables);
    const buttons = this.buildButtons(data.button);

    const body: Record<string, unknown> = {};

    if (data._action === "save_general") {
      if (data.template_name) body.template_name = data.template_name;
      if (data.template_language)
        body.template_language = data.template_language;
      if (data.template_type) body.template_type = data.template_type;
      if (data.notification_type)
        body.notification_type = data.notification_type;
      if (data.template_preview_text)
        body.template_preview_text = data.template_preview_text;
      if (data.template_preview_image)
        body.template_preview_image = data.template_preview_image;
    } else if (data._action === "save_header") {
      if (header !== undefined) body.header = header;
    } else if (data._action === "save_button") {
      body.buttons = buttons;
    }

    const apiResponse = await donationApi.put(
      `/api/client_whatsapp_templates/${uuid}`,
      {
        body,
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async deleteWhatsappTemplateVariable(templateUuid: string, variableUuid: string): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/client_whatsapp_templates/${templateUuid}/variables/${variableUuid}`,
      { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  private buildVariableBody(systemField: string, description: string): Record<string, unknown> {
    const dotIndex = systemField.indexOf(".");
    const table = systemField.slice(0, dotIndex);
    const field = systemField.slice(dotIndex + 1);
    const body: Record<string, unknown> = { table, field, name: field };
    if (description) body.description = description;
    return body;
  }

  async createWhatsappTemplateVariable(
    templateUuid: string,
    data: CreateWhatsappTemplateVariableBody,
  ): Promise<void> {
    const body = this.buildVariableBody(data.system_field, data.description);

    const apiResponse = await donationApi.post(
      `/api/client_whatsapp_templates/${templateUuid}/variables`,
      { body, headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async updateWhatsappTemplateVariable(
    templateUuid: string,
    variableUuid: string,
    data: UpdateWhatsappTemplateVariableBody,
  ): Promise<void> {
    const body = this.buildVariableBody(data.system_field, data.description);

    const apiResponse = await donationApi.put(
      `/api/client_whatsapp_templates/${templateUuid}/variables/${variableUuid}`,
      { body, headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { WhatsappTemplateDal };
