import type { loader } from "~/main/routes/route.campaign.createRecurrence";

type CreateRecurrenceLoader = Awaited<ReturnType<typeof loader>>;

export type { CreateRecurrenceLoader };
