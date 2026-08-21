import type { loader } from "~/main/routes/route.campaign.fundraisers";

type FundraisersLoader = Awaited<ReturnType<typeof loader>>;

export type { FundraisersLoader };
