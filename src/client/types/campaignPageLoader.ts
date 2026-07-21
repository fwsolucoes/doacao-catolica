import type { loader } from "~/main/routes/route.campaign.campaignPage";

type CampaignPageLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignPageLoader };
