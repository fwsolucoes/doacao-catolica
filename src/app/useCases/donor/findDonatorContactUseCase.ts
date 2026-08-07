import type { DonorGatewayDTO } from "~/domain/gateways/donor";

class FindDonatorContactUseCase {
  constructor(private donorGateway: DonorGatewayDTO) {}

  async execute(donatorsId: string, token: string): Promise<string> {
    return await this.donorGateway.findDonatorContact(donatorsId, token);
  }
}

export { FindDonatorContactUseCase };
