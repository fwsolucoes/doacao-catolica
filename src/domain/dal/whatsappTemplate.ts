import type { CreateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplateUpdate";
import type { WhatsappTemplate } from "../views/whatsappTemplate";
import type { WhatsappTemplateDetail } from "../views/whatsappTemplateDetail";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>;
  createWhatsappTemplate(data: CreateWhatsappTemplateBody): Promise<void>;
  getWhatsappTemplate(uuid: string): Promise<WhatsappTemplateDetail>;
  updateWhatsappTemplate(uuid: string, data: UpdateWhatsappTemplateBody): Promise<void>;
};

export type { WhatsappTemplateDalDTO };
