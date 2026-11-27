import type { loader } from "~/main/routes/route.campaign.donorHealthReport";

type DonorHealthReportLoader = Awaited<ReturnType<typeof loader>>;
type DonorHealthReport = DonorHealthReportLoader["donorHealth"];

export type { DonorHealthReport, DonorHealthReportLoader };
