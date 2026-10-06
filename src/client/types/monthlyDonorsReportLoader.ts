import type { MonthlyDonorsJson } from "~/domain/entities/monthlyDonors";

type MonthlyDonorsReportLoader = {
  monthlyDonors: MonthlyDonorsJson;
  campaigns?: { value: string; label: string }[];
};

export type { MonthlyDonorsReportLoader };
