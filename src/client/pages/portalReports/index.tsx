import { Heart, Wallet } from "lucide-react";
import { ReportCard } from "~/client/pages/reports/components/reportCard";

const REPORTS = [
  {
    title: "Resumo Financeiro",
    description:
      "Consolidado financeiro de todas as campanhas: arrecadação, pendências, saldo e ticket médio.",
    icon: Wallet,
    tone: "blue" as const,
    navigateTo: "/financial-summary",
  },
  {
    title: "Doações gerais",
    description:
      "Listagem completa de doações de todas as campanhas com filtros por doador, status, período e método de pagamento.",
    icon: Heart,
    tone: "green" as const,
    navigateTo: "/donations",
  },
];

function PortalReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Relatórios
        </h1>
        <p className="text-sm text-muted-foreground">
          Relatórios consolidados de todas as campanhas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => (
          <ReportCard key={report.title} {...report} />
        ))}
      </div>
    </div>
  );
}

export { PortalReportsPage };
