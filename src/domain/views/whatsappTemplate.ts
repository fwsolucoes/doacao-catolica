type WhatsappTemplateProps = {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
};

type WhatsappTemplateJson = WhatsappTemplateProps;

class WhatsappTemplate {
  uuid: string;
  templateName: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;

  private constructor(props: WhatsappTemplateProps) {
    this.uuid = props.uuid;
    this.templateName = props.templateName;
    this.templateType = props.templateType;
    this.notificationType = props.notificationType;
    this.templatePreviewText = props.templatePreviewText;
  }

  static restore(props: WhatsappTemplateProps): WhatsappTemplate {
    return new WhatsappTemplate(props);
  }

  toJson(): WhatsappTemplateJson {
    return {
      uuid: this.uuid,
      templateName: this.templateName,
      templateType: this.templateType,
      notificationType: this.notificationType,
      templatePreviewText: this.templatePreviewText,
    };
  }
}

export { WhatsappTemplate };
export type { WhatsappTemplateJson };
