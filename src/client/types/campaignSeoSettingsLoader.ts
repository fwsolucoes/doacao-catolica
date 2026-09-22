import type { loader } from "~/main/routes/route.campaign.seoSettings";

type CampaignSeoSettingsLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignSeoSettingsLoader };
