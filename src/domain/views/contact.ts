type ContactConstructorProps = {
  id: string;
  name: string;
};

type ContactRestoreProps = ContactConstructorProps;

class Contact {
  id: string;
  name: string;

  private constructor(props: ContactConstructorProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static restore(props: ContactRestoreProps): Contact {
    return new Contact({ id: props.id, name: props.name });
  }

  toJson() {
    return { id: this.id, name: this.name };
  }
}

export { Contact };
