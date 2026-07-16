type TransferAccountProps = {
  id: string;
  accountId: number;
  type: string | null;
  name: string | null;
  cpfCnpj: string | null;
  documentUrl: string | null;
  pixKey: string | null;
  pixType: string | null;
  agency: string | null;
  responsibleBirthday: string | null;
  responsibleName: string | null;
  responsiblePhone: string | null;
  bank: string | null;
  bankAccount: string | null;
  bankAccountType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
};

class TransferAccount {
  readonly id: string;
  readonly accountId: number;
  readonly type: string | null;
  readonly name: string | null;
  readonly cpfCnpj: string | null;
  readonly documentUrl: string | null;
  readonly pixKey: string | null;
  readonly pixType: string | null;
  readonly agency: string | null;
  readonly responsibleBirthday: string | null;
  readonly responsibleName: string | null;
  readonly responsiblePhone: string | null;
  readonly bank: string | null;
  readonly bankAccount: string | null;
  readonly bankAccountType: string | null;
  readonly createdAt: string | null;
  readonly updatedAt: string | null;
  readonly deletedAt: string | null;

  private constructor(props: TransferAccountProps) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.type = props.type;
    this.name = props.name;
    this.cpfCnpj = props.cpfCnpj;
    this.documentUrl = props.documentUrl;
    this.pixKey = props.pixKey;
    this.pixType = props.pixType;
    this.agency = props.agency;
    this.responsibleBirthday = props.responsibleBirthday;
    this.responsibleName = props.responsibleName;
    this.responsiblePhone = props.responsiblePhone;
    this.bank = props.bank;
    this.bankAccount = props.bankAccount;
    this.bankAccountType = props.bankAccountType;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  static restore(props: TransferAccountProps): TransferAccount {
    return new TransferAccount(props);
  }

  toJson() {
    return {
      id: this.id,
      accountId: this.accountId,
      type: this.type,
      name: this.name,
      cpfCnpj: this.cpfCnpj,
      documentUrl: this.documentUrl,
      pixKey: this.pixKey,
      pixType: this.pixType,
      agency: this.agency,
      responsibleBirthday: this.responsibleBirthday,
      responsibleName: this.responsibleName,
      responsiblePhone: this.responsiblePhone,
      bank: this.bank,
      bankAccount: this.bankAccount,
      bankAccountType: this.bankAccountType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

export { TransferAccount };
export type { TransferAccountProps };
