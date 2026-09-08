type TestWhatsappConnectionResult = {
  connected: boolean;
};

type WhatsappConnectionGatewayDTO = {
  testConnection(token: string): Promise<TestWhatsappConnectionResult>;
};

export type { WhatsappConnectionGatewayDTO, TestWhatsappConnectionResult };
