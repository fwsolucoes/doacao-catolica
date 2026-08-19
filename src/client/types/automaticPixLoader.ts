import type { loader } from "~/main/routes/route.campaign.automaticPix";

type AutomaticPixLoader = Awaited<ReturnType<typeof loader>>;

export type { AutomaticPixLoader };
