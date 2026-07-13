import type { loader } from "~/main/routes/route.campaign.donations";

type DonationsLoader = Awaited<ReturnType<typeof loader>>;

export type { DonationsLoader };
