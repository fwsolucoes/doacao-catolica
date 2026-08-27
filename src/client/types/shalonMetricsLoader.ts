import type { loader } from "~/main/routes/route.campaign.shalonMetrics";

type ShalonMetricsLoader = Awaited<ReturnType<typeof loader>>;

export type { ShalonMetricsLoader };
