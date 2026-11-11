import type { loader } from "~/main/routes/route.campaign.raffles";

type RafflesLoader = Awaited<ReturnType<typeof loader>>;

export type { RafflesLoader };
