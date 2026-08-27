import type { loader } from "~/main/routes/route.campaign.shalomMetrics";

type ShalomMetricsLoader = Awaited<ReturnType<typeof loader>>;

export type { ShalomMetricsLoader };
