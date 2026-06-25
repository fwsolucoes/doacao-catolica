type DonorProps = {
  id: string;
  contactId: string;
  name: string;
  email: string | null;
  cpf: string | null;
  birthDate: string | null;
  phone: string | null;
  whatsapp: string | null;
  donorType: string;
  createdAt: string;
};

class Donor {
  readonly id: string;
  readonly contactId: string;
  readonly name: string;
  readonly email: string | null;
  readonly cpf: string | null;
  readonly birthDate: string | null;
  readonly phone: string | null;
  readonly whatsapp: string | null;
  readonly donorType: string;
  readonly createdAt: string;

  private constructor(props: DonorProps) {
    this.id = props.id;
    this.contactId = props.contactId;
    this.name = props.name;
    this.email = props.email;
    this.cpf = props.cpf;
    this.birthDate = props.birthDate;
    this.phone = props.phone;
    this.whatsapp = props.whatsapp;
    this.donorType = props.donorType;
    this.createdAt = props.createdAt;
  }

  static restore(props: DonorProps): Donor {
    return new Donor(props);
  }

  toJson() {
    return {
      id: this.id,
      contactId: this.contactId,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      birthDate: this.birthDate,
      phone: this.phone,
      whatsapp: this.whatsapp,
      donorType: this.donorType,
      createdAt: this.createdAt,
    };
  }
}

export { Donor };
export type { DonorProps };
