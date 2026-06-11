import type { loader } from "~/main/routes/layout.campaignLayout";

type CampaignLayoutLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignLayoutLoader };
