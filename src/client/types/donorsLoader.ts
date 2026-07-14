import type { loader } from "~/main/routes/route.campaign.donors";

type DonorsLoader = Awaited<ReturnType<typeof loader>>;

export type { DonorsLoader };
