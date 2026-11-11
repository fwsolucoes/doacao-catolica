import type { loader } from "~/main/routes/route.campaign.raffleTickets";

type RaffleTicketsLoader = Awaited<ReturnType<typeof loader>>;

export type { RaffleTicketsLoader };
