import type { loader } from "~/main/routes/route.campaign.generalInfo";

type CampaignGeneralInfoLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignGeneralInfoLoader };
