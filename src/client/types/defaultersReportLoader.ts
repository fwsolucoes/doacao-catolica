import type { loader } from "~/main/routes/route.campaign.defaultersReport";

type DefaultersReportLoader = Awaited<ReturnType<typeof loader>>;

export type { DefaultersReportLoader };
