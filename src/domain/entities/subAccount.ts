type PersonType = "PJ" | "PF";

type SubAccountProps = {
  subAccountId: string;
  accountId: number;
  name: string;
  email: string;
  loginEmail: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string | null;
  province: string;
  postalCode: string;
  cpfCnpj: string;
  birthDate: string;
  personType: PersonType;
  companyType: string;
  city: string;
  state: string;
  country: string;
  tradingName: string;
  site: string;
  incomeRange: string;
  gatewayId: string | null;
  apiKey: string;
  walletId: string;
  gatewayStatus: number;
  lastSyncDate: string;
  responseStatus: string;
  dioceseId: string | null;
  institutionName: string | null;
  domainOrigin: string | null;
  institutionTypeId: string | null;
  institutionPhone: string | null;
  institutionDescription: string;
  instagramProfile: string | null;
  facebookProfile: string | null;
  adminComments: string | null;
  adminIsApproved: boolean;
  createdAt: string;
  updatedAt: string;
};

class SubAccount {
  readonly subAccountId: string;
  readonly accountId: number;
  readonly name: string;
  readonly email: string;
  readonly loginEmail: string;
  readonly phone: string;
  readonly mobilePhone: string;
  readonly address: string;
  readonly addressNumber: string;
  readonly complement: string | null;
  readonly province: string;
  readonly postalCode: string;
  readonly cpfCnpj: string;
  readonly birthDate: string;
  readonly personType: PersonType;
  readonly companyType: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly tradingName: string;
  readonly site: string;
  readonly incomeRange: string;
  readonly gatewayId: string | null;
  readonly apiKey: string;
  readonly walletId: string;
  readonly gatewayStatus: number;
  readonly lastSyncDate: string;
  readonly responseStatus: string;
  readonly dioceseId: string | null;
  readonly institutionName: string | null;
  readonly domainOrigin: string | null;
  readonly institutionTypeId: string | null;
  readonly institutionPhone: string | null;
  readonly institutionDescription: string;
  readonly instagramProfile: string | null;
  readonly facebookProfile: string | null;
  readonly adminComments: string | null;
  readonly adminIsApproved: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  private constructor(props: SubAccountProps) {
    this.subAccountId = props.subAccountId;
    this.accountId = props.accountId;
    this.name = props.name;
    this.email = props.email;
    this.loginEmail = props.loginEmail;
    this.phone = props.phone;
    this.mobilePhone = props.mobilePhone;
    this.address = props.address;
    this.addressNumber = props.addressNumber;
    this.complement = props.complement;
    this.province = props.province;
    this.postalCode = props.postalCode;
    this.cpfCnpj = props.cpfCnpj;
    this.birthDate = props.birthDate;
    this.personType = props.personType;
    this.companyType = props.companyType;
    this.city = props.city;
    this.state = props.state;
    this.country = props.country;
    this.tradingName = props.tradingName;
    this.site = props.site;
    this.incomeRange = props.incomeRange;
    this.gatewayId = props.gatewayId;
    this.apiKey = props.apiKey;
    this.walletId = props.walletId;
    this.gatewayStatus = props.gatewayStatus;
    this.lastSyncDate = props.lastSyncDate;
    this.responseStatus = props.responseStatus;
    this.dioceseId = props.dioceseId;
    this.institutionName = props.institutionName;
    this.domainOrigin = props.domainOrigin;
    this.institutionTypeId = props.institutionTypeId;
    this.institutionPhone = props.institutionPhone;
    this.institutionDescription = props.institutionDescription;
    this.instagramProfile = props.instagramProfile;
    this.facebookProfile = props.facebookProfile;
    this.adminComments = props.adminComments;
    this.adminIsApproved = props.adminIsApproved;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static restore(props: SubAccountProps): SubAccount {
    return new SubAccount(props);
  }

  toJson() {
    return {
      subAccountId: this.subAccountId,
      accountId: this.accountId,
      name: this.name,
      email: this.email,
      loginEmail: this.loginEmail,
      phone: this.phone,
      mobilePhone: this.mobilePhone,
      address: this.address,
      addressNumber: this.addressNumber,
      complement: this.complement,
      province: this.province,
      postalCode: this.postalCode,
      cpfCnpj: this.cpfCnpj,
      birthDate: this.birthDate,
      personType: this.personType,
      companyType: this.companyType,
      city: this.city,
      state: this.state,
      country: this.country,
      tradingName: this.tradingName,
      site: this.site,
      incomeRange: this.incomeRange,
      gatewayId: this.gatewayId,
      apiKey: this.apiKey,
      walletId: this.walletId,
      gatewayStatus: this.gatewayStatus,
      lastSyncDate: this.lastSyncDate,
      responseStatus: this.responseStatus,
      dioceseId: this.dioceseId,
      institutionName: this.institutionName,
      domainOrigin: this.domainOrigin,
      institutionTypeId: this.institutionTypeId,
      institutionPhone: this.institutionPhone,
      institutionDescription: this.institutionDescription,
      instagramProfile: this.instagramProfile,
      facebookProfile: this.facebookProfile,
      adminComments: this.adminComments,
      adminIsApproved: this.adminIsApproved,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export { SubAccount };
export type { PersonType, SubAccountProps };
