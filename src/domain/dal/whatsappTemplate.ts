import type { WhatsappTemplate } from "../views/whatsappTemplate";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>;
};

export type { WhatsappTemplateDalDTO };
