import type { CreateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplate";
import type { UpdateWhatsappTemplateBody } from "~/infra/schemas/internal/whatsappTemplateUpdate";
import type { CreateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonCreate";
import type { UpdateWhatsappTemplateButtonBody } from "~/infra/schemas/internal/whatsappTemplateButtonUpdate";
import type { UpdateWhatsappTemplateHeaderBody } from "~/infra/schemas/internal/whatsappTemplateHeaderUpdate";
import type { CreateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableCreate";
import type { DeleteWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableDelete";
import type { UpdateWhatsappTemplateVariableBody } from "~/infra/schemas/internal/whatsappTemplateVariableUpdate";
import type { WhatsappTemplate } from "../views/whatsappTemplate";
import type { WhatsappTemplateDetail } from "../views/whatsappTemplateDetail";

type WhatsappTemplateDalDTO = {
  listWhatsappTemplates(
    campaignId: string,
    notificationType?: string,
    templateType?: string,
  ): Promise<WhatsappTemplate[]>;
  listClientWhatsappTemplates(
    notificationType?: string,
    templateType?: string,
  ): Promise<WhatsappTemplate[]>;
  createWhatsappTemplate(campaignId: string, data: CreateWhatsappTemplateBody): Promise<void>;
  getWhatsappTemplate(campaignId: string, uuid: string): Promise<WhatsappTemplateDetail>;
  updateWhatsappTemplate(
    campaignId: string,
    uuid: string,
    data: UpdateWhatsappTemplateBody,
  ): Promise<void>;
  updateWhatsappTemplateHeader(
    campaignId: string,
    templateUuid: string,
    headerUuid: string,
    data: UpdateWhatsappTemplateHeaderBody,
  ): Promise<void>;
  createWhatsappTemplateButton(
    campaignId: string,
    templateUuid: string,
    data: CreateWhatsappTemplateButtonBody,
  ): Promise<void>;
  updateWhatsappTemplateButton(
    campaignId: string,
    templateUuid: string,
    buttonUuid: string,
    data: UpdateWhatsappTemplateButtonBody,
  ): Promise<void>;
  deleteWhatsappTemplateButton(
    campaignId: string,
    templateUuid: string,
    buttonUuid: string,
  ): Promise<void>;
  createWhatsappTemplateVariable(
    campaignId: string,
    templateUuid: string,
    data: CreateWhatsappTemplateVariableBody,
  ): Promise<void>;
  deleteWhatsappTemplateVariable(
    campaignId: string,
    templateUuid: string,
    variableUuid: string,
  ): Promise<void>;
  updateWhatsappTemplateVariable(
    campaignId: string,
    templateUuid: string,
    variableUuid: string,
    data: UpdateWhatsappTemplateVariableBody,
  ): Promise<void>;
};

export type { WhatsappTemplateDalDTO };
