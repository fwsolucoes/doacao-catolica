type WhatsappTemplateDetailVariable = {
  uuid: string;
  systemField: string;
  name: string | null;
  description: string | null;
};

type WhatsappTemplateDetailButton = {
  uuid: string;
  subType: string;
  value: string;
};

type WhatsappTemplateDetailProps = {
  uuid: string;
  templateName: string;
  templateLanguage: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
  templatePreviewImage: string;
  headerUuid: string | null;
  headerType: string;
  headerText: string;
  headerLink: string;
  variables: WhatsappTemplateDetailVariable[];
  button: WhatsappTemplateDetailButton | null;
};

type WhatsappTemplateDetailJson = WhatsappTemplateDetailProps;

class WhatsappTemplateDetail {
  uuid: string;
  templateName: string;
  templateLanguage: string;
  templateType: string;
  notificationType: string;
  templatePreviewText: string;
  templatePreviewImage: string;
  headerUuid: string | null;
  headerType: string;
  headerText: string;
  headerLink: string;
  variables: WhatsappTemplateDetailVariable[];
  button: WhatsappTemplateDetailButton | null;

  private constructor(props: WhatsappTemplateDetailProps) {
    this.uuid = props.uuid;
    this.templateName = props.templateName;
    this.templateLanguage = props.templateLanguage;
    this.templateType = props.templateType;
    this.notificationType = props.notificationType;
    this.templatePreviewText = props.templatePreviewText;
    this.templatePreviewImage = props.templatePreviewImage;
    this.headerUuid = props.headerUuid;
    this.headerType = props.headerType;
    this.headerText = props.headerText;
    this.headerLink = props.headerLink;
    this.variables = props.variables;
    this.button = props.button;
  }

  static restore(props: WhatsappTemplateDetailProps): WhatsappTemplateDetail {
    return new WhatsappTemplateDetail(props);
  }

  toJson(): WhatsappTemplateDetailJson {
    return {
      uuid: this.uuid,
      templateName: this.templateName,
      templateLanguage: this.templateLanguage,
      templateType: this.templateType,
      notificationType: this.notificationType,
      templatePreviewText: this.templatePreviewText,
      templatePreviewImage: this.templatePreviewImage,
      headerUuid: this.headerUuid,
      headerType: this.headerType,
      headerText: this.headerText,
      headerLink: this.headerLink,
      variables: this.variables,
      button: this.button,
    };
  }
}

export { WhatsappTemplateDetail };
export type {
  WhatsappTemplateDetailJson,
  WhatsappTemplateDetailVariable,
  WhatsappTemplateDetailButton,
};
