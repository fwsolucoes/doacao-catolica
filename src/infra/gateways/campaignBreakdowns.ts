import type { CampaignBreakdownsSearchParams } from "~/app/search/campaignBreakdownsSearchParams";
import type {
  CampaignBreakdownsData,
  CampaignBreakdownsGatewayDTO,
} from "~/domain/gateways/campaignBreakdowns";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalCampaignBreakdownsSchema } from "../schemas/external/campaignBreakdowns";

class CampaignBreakdownsGateway implements CampaignBreakdownsGatewayDTO {
  async getBreakdowns(
    campaignId: string,
    searchParams: CampaignBreakdownsSearchParams,
  ): Promise<CampaignBreakdownsData> {
    let url = `/api/campaign/breakdowns/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalCampaignBreakdownsSchema,
    ).validate(apiResponse.response);

    const { payment_methods, donation_ranges, donor_profile, conversion_funnel } =
      data.data;

    return {
      paymentMethods: payment_methods.map((m) => ({
        paymentMethod: m.payment_method,
        donationsCount: m.donations_count,
        totalAmount: m.total_amount,
        percentage: m.percentage,
      })),
      donationRanges: donation_ranges.map((r) => ({
        label: r.label,
        minAmount: r.min_amount,
        maxAmount: r.max_amount,
        donationsCount: r.donations_count,
      })),
      donorProfile: donor_profile.map((p) => ({
        range: p.range,
        donorsCount: p.donors_count,
      })),
      conversionFunnel: {
        pageVisits: conversion_funnel.page_visits,
        registrations: conversion_funnel.registrations,
        registrationsSubscriptions: conversion_funnel.registrations_subscriptions,
        registrationsTransfers: conversion_funnel.registrations_transfers,
        completedDonations: conversion_funnel.completed_donations,
        completedSubscriptions: conversion_funnel.completed_subscriptions,
        completedTransfers: conversion_funnel.completed_transfers,
        conversionPercentage: conversion_funnel.conversion_percentage,
      },
    };
  }
}

export { CampaignBreakdownsGateway };
