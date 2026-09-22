import type { EmailTemplateDalDTO } from "~/domain/dal/emailTemplate";
import { EmailTemplate } from "~/domain/views/emailTemplate";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { listEmailTemplatesSchema } from "../schemas/external/emailTemplate";

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
}

export { EmailTemplateDal };
