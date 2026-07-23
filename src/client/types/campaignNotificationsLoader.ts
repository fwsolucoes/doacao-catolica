import type { loader } from "~/main/routes/route.campaign.notifications";

type CampaignNotificationsLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignNotificationsLoader };
