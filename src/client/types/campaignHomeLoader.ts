import type { loader } from "~/main/routes/route.campaign.home";

type CampaignHomeLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignHomeLoader };
