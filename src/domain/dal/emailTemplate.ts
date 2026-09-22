import type { CreateEmailTemplateBody } from "~/infra/schemas/internal/emailTemplate";
import type { EmailTemplate } from "../views/emailTemplate";

type EmailTemplateDalDTO = {
  listEmailTemplates(campaignId: string): Promise<EmailTemplate[]>;
  createEmailTemplate(campaignId: string, data: CreateEmailTemplateBody): Promise<void>;
};

export type { EmailTemplateDalDTO };
