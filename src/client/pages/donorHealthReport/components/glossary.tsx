import { Separator } from "~/client/components/ui/separator";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";

function Glossary({ report }: { report: DonorHealthReport }) {
  const lapse = report.lapseMonthsInWords;
  const loyalty = report.loyaltyWindowInWords;

  const terms = [
    {
      term: "Receita",
      details:
        "Pagamentos da campanha com status confirmed, received ou manual. O mês é definido pela confirmação do cartão ou pela data de pagamento do boleto, Pix e Pix automático.",
    },
    {
      term: "Doações e doadores",
      details:
        "Pagamentos recebidos ligados a subscriptions. O doador é o cliente da subscription.",
    },
    {
      term: "Doador fiel",
      details: `Doou em todos os ${loyalty} até o mês indicado, incluindo ele.`,
    },
    {
      term: "Novo lapso e sem retorno",
      details: `Doou ${lapse} antes e não doou em nenhum dos ${lapse} seguintes. Sem retorno é quem nunca mais doou depois.`,
    },
    {
      term: "Recuperado",
      details: `Doou no mês depois de ficar ${lapse} sem doar, tendo doado antes disso.`,
    },
    {
      term: "Subscriptions novas e canceladas",
      details:
        "Novas pela data de criação; canceladas pelo histórico de cancelamentos. Quando o histórico não cobre o período, os cancelamentos são estimativas.",
    },
    {
      term: "Mês parcial e valores indisponíveis",
      details:
        "O mês corrente ainda não terminou. Os indicadores usam o último mês fechado; um traço significa que não há dados calculáveis, não zero.",
    },
  ];

  return (
    <section className="flex flex-col gap-4" aria-labelledby="donor-health-glossary">
      <Separator />
      <h2 id="donor-health-glossary" className="text-sm font-semibold text-(--text-heading)">
        Como ler estes números
      </h2>
      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {terms.map(({ term, details }) => (
          <div key={term} className="flex flex-col gap-1">
            <dt className="text-sm font-semibold text-foreground">{term}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">{details}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export { Glossary };
