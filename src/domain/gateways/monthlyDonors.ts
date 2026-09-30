import type { MonthlyDonorsSearchParams } from "~/app/search/monthlyDonorsSearchParams";
import type { MonthlyDonorsJson } from "../entities/monthlyDonors";

type MonthlyDonorsGatewayDTO = {
  getMonthlyDonors(
    searchParams: MonthlyDonorsSearchParams,
  ): Promise<MonthlyDonorsJson>;
};

export type { MonthlyDonorsGatewayDTO };
