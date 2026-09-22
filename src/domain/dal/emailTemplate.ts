import type { EmailTemplate } from "../views/emailTemplate";

type EmailTemplateDalDTO = {
  listEmailTemplates(campaignId: string): Promise<EmailTemplate[]>;
};

export type { EmailTemplateDalDTO };
