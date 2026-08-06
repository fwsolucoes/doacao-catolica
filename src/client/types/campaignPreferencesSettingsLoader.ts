import type { loader } from "~/main/routes/route.campaign.preferences";

type CampaignPreferencesSettingsLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignPreferencesSettingsLoader };
