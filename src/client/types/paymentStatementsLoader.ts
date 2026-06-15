import type { loader } from "~/main/routes/route.campaign.paymentStatements";

type PaymentStatementsLoader = Awaited<ReturnType<typeof loader>>;

export type { PaymentStatementsLoader };
