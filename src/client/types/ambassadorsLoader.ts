import type { loader } from "~/main/routes/route.campaign.ambassadors";

type AmbassadorsLoader = Awaited<ReturnType<typeof loader>>;

export type { AmbassadorsLoader };
