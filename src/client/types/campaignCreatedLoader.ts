import type { loader } from "~/main/routes/route.campaign.created";

type CampaignCreatedLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignCreatedLoader };
