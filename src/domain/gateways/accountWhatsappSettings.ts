type CreateAccountWhatsappSettingsInput = {
  accountReference: string;
  provider: string;
  type: string;
  active: boolean;
  token?: string;
  utilityFee: number;
  marketingFee: number;
};

type AccountWhatsappSettingsGatewayDTO = {
  createAccountWhatsappSettings: (
    input: CreateAccountWhatsappSettingsInput,
  ) => Promise<void>;
};

export type {
  AccountWhatsappSettingsGatewayDTO,
  CreateAccountWhatsappSettingsInput,
};
