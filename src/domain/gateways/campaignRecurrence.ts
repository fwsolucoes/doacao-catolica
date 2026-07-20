import type { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";

type RecurrenceMonth = {
  month: string;
  label: string;
  activeSubscriptions: number;
  recurringDonations: number;
  recurringAmount: number;
};

type CampaignRecurrenceData = {
  months: RecurrenceMonth[];
};

type CampaignRecurrenceGatewayDTO = {
  getRecurrence(
    campaignId: string,
    searchParams: CampaignRecurrenceSearchParams,
  ): Promise<CampaignRecurrenceData>;
};

export type {
  CampaignRecurrenceGatewayDTO,
  CampaignRecurrenceData,
  RecurrenceMonth,
};
