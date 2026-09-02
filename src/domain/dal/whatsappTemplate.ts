import type { CreateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplateUpdate";
import type { CreateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonCreate";
import type { UpdateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonUpdate";
import type { CreateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableCreate";
import type { DeleteWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableDelete";
import type { UpdateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableUpdate";
import type { WhatsappTemplate } from "../views/whatsappTemplate";
import type { WhatsappTemplateDetail } from "../views/whatsappTemplateDetail";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(notificationType?: string): Promise<WhatsappTemplate[]>;
  createWhatsappTemplate(data: CreateWhatsappTemplateBody): Promise<void>;
  getWhatsappTemplate(uuid: string): Promise<WhatsappTemplateDetail>;
  updateWhatsappTemplate(uuid: string, data: UpdateWhatsappTemplateBody): Promise<void>;
  createWhatsappTemplateButton(
    templateUuid: string,
    data: CreateWhatsappTemplateButtonBody,
  ): Promise<void>;
  updateWhatsappTemplateButton(
    templateUuid: string,
    buttonUuid: string,
    data: UpdateWhatsappTemplateButtonBody,
  ): Promise<void>;
  createWhatsappTemplateVariable(
    templateUuid: string,
    data: CreateWhatsappTemplateVariableBody,
  ): Promise<void>;
  deleteWhatsappTemplateVariable(templateUuid: string, variableUuid: string): Promise<void>;
  updateWhatsappTemplateVariable(
    templateUuid: string,
    variableUuid: string,
    data: UpdateWhatsappTemplateVariableBody,
  ): Promise<void>;
};

export type { WhatsappTemplateDalDTO };
