import { Cake, HeartHandshake, Repeat2, UserMinus } from "lucide-react";
import { ReportCard } from "./components/reportCard";

const REPORTS = [
  {
    title: "Aniversariantes",
    description:
      "Lista de doadores aniversariantes do mês para ações de relacionamento.",
    icon: Cake,
    tone: "amber" as const,
  },
  {
    title: "Lapsos no período",
    description:
      "Doadores recorrentes que interromperam contribuições no período selecionado.",
    icon: UserMinus,
    tone: "rose" as const,
  },
  {
    title: "Relatório de Doações",
    description:
      "Consolidado de todas as doações realizadas com filtros por período, método e status.",
    icon: HeartHandshake,
    tone: "green" as const,
  },
  {
    title: "Relatório de Recorrências",
    description:
      "Panorama completo dos doadores recorrentes ativos, previsão mensal e churn.",
    icon: Repeat2,
    tone: "violet" as const,
  },
];

function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Relatórios
        </h1>
        <p className="text-sm text-muted-foreground">
          Gere relatórios detalhados da campanha em poucos cliques.
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

export { ReportsPage };
