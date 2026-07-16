import type { loader } from "~/main/routes/route.campaign.transfers";

type TransfersLoader = Awaited<ReturnType<typeof loader>>;

export type { TransfersLoader };
