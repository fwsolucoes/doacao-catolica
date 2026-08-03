import type { loader } from "~/main/routes/route.createCampaign";

type CreateCampaignLoader = Awaited<ReturnType<typeof loader>>;

export type { CreateCampaignLoader };
