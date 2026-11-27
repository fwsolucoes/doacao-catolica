import type { DonorHealthSearchParams } from "~/app/search/donorHealthSearchParams";
import type { DonorHealth } from "../entities/donorHealth";

type DonorHealthGatewayDTO = {
  getDonorHealth(
    accountId: number,
    searchParams: DonorHealthSearchParams,
  ): Promise<DonorHealth>;
};

export type { DonorHealthGatewayDTO };
