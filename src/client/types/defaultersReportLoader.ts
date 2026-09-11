import type { DefaultingDonorsJson } from "~/domain/entities/defaultingDonors";

type DefaultersReportLoader = {
  defaultingDonors: DefaultingDonorsJson;
  months: number;
  campaigns?: { id: string; name: string }[];
};

export type { DefaultersReportLoader };
