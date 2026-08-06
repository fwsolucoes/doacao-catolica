import type { loader } from "~/main/routes/route.campaign.email";

type CampaignEmailLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignEmailLoader };
