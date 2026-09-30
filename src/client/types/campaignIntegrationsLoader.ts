import type { loader } from "~/main/routes/route.campaign.integrations";

type CampaignIntegrationsLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignIntegrationsLoader };
