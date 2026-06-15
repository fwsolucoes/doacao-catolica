type CreateDonorInput = {
  accountId: number;
  name: string;
  cpf?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  projectId: string;
  token: string;
};

type DonorGatewayDTO = {
  createDonor(input: CreateDonorInput): Promise<string>;
};

export type { DonorGatewayDTO, CreateDonorInput };
