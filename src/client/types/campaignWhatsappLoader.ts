import type { loader } from "~/main/routes/route.campaign.whatsapp";

type CampaignWhatsappLoader = Awaited<ReturnType<typeof loader>>;

export type { CampaignWhatsappLoader };
