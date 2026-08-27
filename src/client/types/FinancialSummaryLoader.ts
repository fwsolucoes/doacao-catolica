import type { loader } from "~/main/routes/route.financialSummary";

type FinancialSummaryLoader = Awaited<ReturnType<typeof loader>>;

export type { FinancialSummaryLoader };
