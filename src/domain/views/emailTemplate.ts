type EmailTemplateConstructorProps = {
  uuid: string;
  type: string;
  body: string;
  createdAt: string;
};

type EmailTemplateRestoreProps = EmailTemplateConstructorProps;

class EmailTemplate {
  uuid: string;
  type: string;
  body: string;
  createdAt: string;

  private constructor(props: EmailTemplateConstructorProps) {
    this.uuid = props.uuid;
    this.type = props.type;
    this.body = props.body;
    this.createdAt = props.createdAt;
  }

  static restore(props: EmailTemplateRestoreProps): EmailTemplate {
    return new EmailTemplate(props);
  }

  toJson() {
    const [createdAt] = this.createdAt.split(" ");
    return {
      uuid: this.uuid,
      type: this.type,
      body: this.body,
      createdAt: createdAt ?? "",
    };
  }
}

export { EmailTemplate };
