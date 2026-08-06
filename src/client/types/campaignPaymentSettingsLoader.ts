import type { loader } from "~/main/routes/route.campaign.paymentMethods";

type CampaignPaymentSettingsLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignPaymentSettingsLoader };
