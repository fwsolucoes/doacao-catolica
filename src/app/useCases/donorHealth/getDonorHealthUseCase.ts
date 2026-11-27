import { DonorHealthSearchParams } from "~/app/search/donorHealthSearchParams";
import type { DonorHealthGatewayDTO } from "~/domain/gateways/donorHealth";

type InputProps = {
  accountId: number;
  months: number;
  lapseMonths: number;
};

class GetDonorHealthUseCase {
  constructor(private gateway: DonorHealthGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new DonorHealthSearchParams({
      filter: { months: input.months, lapse_months: input.lapseMonths },
    });

    const report = await this.gateway.getDonorHealth(input.accountId, searchParams);
    return report.toJson();
  }
}

export { GetDonorHealthUseCase };
