type CreateAccountWhatsappSettingsInput = {
  accountReference: string;
  provider: string;
  type: string;
  active: boolean;
  token?: string;
  utilityFee: number;
  marketingFee: number;
};

type UpdateAccountWhatsappSettingsInput = {
  accountReference: string;
  provider: string;
  type: string;
};

type AccountWhatsappSettingsData = {
  type: string | null;
  provider: string | null;
  hasToken: boolean;
  active: boolean;
};

type AccountWhatsappSettingsGatewayDTO = {
  createAccountWhatsappSettings: (
    input: CreateAccountWhatsappSettingsInput,
  ) => Promise<void>;
  updateAccountWhatsappSettings: (
    input: UpdateAccountWhatsappSettingsInput,
  ) => Promise<void>;
  getAccountWhatsappSettings: (
    accountReference: string,
  ) => Promise<AccountWhatsappSettingsData | null>;
};

export type {
  AccountWhatsappSettingsGatewayDTO,
  AccountWhatsappSettingsData,
  CreateAccountWhatsappSettingsInput,
  UpdateAccountWhatsappSettingsInput,
};
