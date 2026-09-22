import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";
import { EmailTemplate } from "~/domain/views/emailTemplate";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { listEmailTemplatesSchema } from "../schemas/external/emailTemplate";
import type { CreateEmailTemplateBody, UpdateEmailTemplateBody } from "../schemas/internal/emailTemplate";

class EmailTemplateDal implements EmailTemplateDalDTO {
  async listEmailTemplates(campaignId: string): Promise<EmailTemplate[]> {
    const apiResponse = await donationApi.get(
      `/api/account_mail_templates/${campaignId}`,
      { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validated = new SchemaValidatorAdapter(
      listEmailTemplatesSchema,
    ).validate(apiResponse.response);

    return (validated.data ?? []).map((item) =>
      EmailTemplate.restore({
        uuid: item.uuid,
        type: item.type,
        body: item.body,
        createdAt: item.created_at2 ?? "",
      }),
    );
  }

  async createEmailTemplate(
    campaignId: string,
    data: CreateEmailTemplateBody,
  ): Promise<void> {
    const body = {
      type: data.type,
      body: data.body,
    };

    const apiResponse = await donationApi.post(
      `/api/account_mail_templates/${campaignId}`,
      {
        body,
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success)
      throw HttpAdapter.badGateway(
        apiResponse.response.errors.type[0] ?? apiResponse.message,
      );
  }

  async updateEmailTemplate(
    campaignId: string,
    data: UpdateEmailTemplateBody,
  ): Promise<void> {
    const apiResponse = await donationApi.put(
      `/api/account_mail_templates/${campaignId}`,
      {
        body: { type: data.type, body: data.body },
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async deleteEmailTemplate(campaignId: string, type: string): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/account_mail_templates/${campaignId}/${type}`,
      { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { EmailTemplateDal };
