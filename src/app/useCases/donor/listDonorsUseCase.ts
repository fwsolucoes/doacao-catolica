import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  projectId: string;
  accountId: number;
  page?: number | null;
  search?: string;
  token: string;
};

class ListDonorsUseCase {
  constructor(private gateway: DonorGatewayDTO) {}

  async execute(input: InputProps) {
    const { projectId, accountId, page, search, token } = input;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    const result = await this.gateway.listDonors(
      projectId,
      accountId,
      searchParams,
      token,
    );

    return result.toJson();
  }
}

export { ListDonorsUseCase };
