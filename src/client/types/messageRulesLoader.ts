import type { loader } from "~/main/routes/route.campaign.messageRules";

type MessageRulesLoader = Awaited<ReturnType<typeof loader>>;

export type { MessageRulesLoader };
