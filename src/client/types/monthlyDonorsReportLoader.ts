import type { MonthlyDonorsJson } from "~/domain/entities/monthlyDonors";

type MonthlyDonorsReportLoader = {
  monthlyDonors: MonthlyDonorsJson;
  campaigns?: { id: string; name: string }[];
};

export type { MonthlyDonorsReportLoader };
