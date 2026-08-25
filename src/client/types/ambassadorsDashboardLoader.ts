import type { loader } from "~/main/routes/route.campaign.ambassadorsReport";

type AmbassadorsDashboardLoader = Awaited<ReturnType<typeof loader>>;

export type { AmbassadorsDashboardLoader };
