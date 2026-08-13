import type { CreateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplate";
import type { WhatsappTemplate } from "../views/whatsappTemplate";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>;
  createWhatsappTemplate(data: CreateWhatsappTemplateBody): Promise<void>;
};

export type { WhatsappTemplateDalDTO };
