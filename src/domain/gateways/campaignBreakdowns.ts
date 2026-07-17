import type { CampaignBreakdownsSearchParams } from "~/app/search/campaignBreakdownsSearchParams";

type PaymentMethodBreakdown = {
  paymentMethod: string;
  donationsCount: number;
  totalAmount: number;
  percentage: number;
};

type DonationRange = {
  label: string;
  minAmount: number;
  maxAmount: number | null;
  donationsCount: number;
};

type DonorProfileRange = {
  range: string;
  donorsCount: number;
};

type ConversionFunnel = {
  pageVisits: number;
  registrations: number;
  registrationsSubscriptions: number;
  registrationsTransfers: number;
  completedDonations: number;
  completedSubscriptions: number;
  completedTransfers: number;
  conversionPercentage: number;
};

type CampaignBreakdownsData = {
  paymentMethods: PaymentMethodBreakdown[];
  donationRanges: DonationRange[];
  donorProfile: DonorProfileRange[];
  conversionFunnel: ConversionFunnel;
};

type CampaignBreakdownsGatewayDTO = {
  getBreakdowns(
    campaignId: string,
    searchParams: CampaignBreakdownsSearchParams,
  ): Promise<CampaignBreakdownsData>;
};

export type {
  CampaignBreakdownsGatewayDTO,
  CampaignBreakdownsData,
  PaymentMethodBreakdown,
  DonationRange,
  DonorProfileRange,
  ConversionFunnel,
};
