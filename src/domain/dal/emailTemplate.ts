import type { CreateEmailTemplateBody, UpdateEmailTemplateBody } from "~/infra/schemas/internal/emailTemplate";
import type { EmailTemplate } from "../views/emailTemplate";

type EmailTemplateDalDTO = {
  listEmailTemplates(campaignId: string): Promise<EmailTemplate[]>;
  createEmailTemplate(campaignId: string, data: CreateEmailTemplateBody): Promise<void>;
  updateEmailTemplate(campaignId: string, data: UpdateEmailTemplateBody): Promise<void>;
  deleteEmailTemplate(campaignId: string, type: string): Promise<void>;
};

export type { EmailTemplateDalDTO };
