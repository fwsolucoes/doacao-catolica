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

type AccountWhatsappSettingsGatewayDTO = {
  createAccountWhatsappSettings: (
    input: CreateAccountWhatsappSettingsInput,
  ) => Promise<void>;
  updateAccountWhatsappSettings: (
    input: UpdateAccountWhatsappSettingsInput,
  ) => Promise<void>;
};

export type {
  AccountWhatsappSettingsGatewayDTO,
  CreateAccountWhatsappSettingsInput,
  UpdateAccountWhatsappSettingsInput,
};
