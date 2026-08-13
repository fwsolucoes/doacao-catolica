type WhatsappTemplateProps = {
  uuid: string;
  templateName: string;
  templateLanguage: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
  headerType: string | null;
  variablesCount: number;
  buttonsCount: number;
};

type WhatsappTemplateJson = WhatsappTemplateProps;

class WhatsappTemplate {
  uuid: string;
  templateName: string;
  templateLanguage: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
  headerType: string | null;
  variablesCount: number;
  buttonsCount: number;

  private constructor(props: WhatsappTemplateProps) {
    this.uuid = props.uuid;
    this.templateName = props.templateName;
    this.templateLanguage = props.templateLanguage;
    this.templateType = props.templateType;
    this.notificationType = props.notificationType;
    this.templatePreviewText = props.templatePreviewText;
    this.headerType = props.headerType;
    this.variablesCount = props.variablesCount;
    this.buttonsCount = props.buttonsCount;
  }

  static restore(props: WhatsappTemplateProps): WhatsappTemplate {
    return new WhatsappTemplate(props);
  }

  toJson(): WhatsappTemplateJson {
    return {
      uuid: this.uuid,
      templateName: this.templateName,
      templateLanguage: this.templateLanguage,
      templateType: this.templateType,
      notificationType: this.notificationType,
      templatePreviewText: this.templatePreviewText,
      headerType: this.headerType,
      variablesCount: this.variablesCount,
      buttonsCount: this.buttonsCount,
    };
  }
}

export { WhatsappTemplate };
export type { WhatsappTemplateJson };
