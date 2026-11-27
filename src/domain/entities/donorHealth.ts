import { formatCurrency } from "~/lib/formatCurrency";

type DonorHealthMonth = {
  /** YYYY-MM */
  month: string;
  /** mês corrente, ainda não fechado */
  isPartial: boolean;
  revenueTotal: number;
  revenueBoleto: number;
  revenuePix: number;
  revenueCard: number;
  revenueAutomaticPix: number;
  donations: number;
  donors: number;
  // null = sem dados calculáveis no mês (exibido como "–", nunca como zero)
  loyalDonors: number | null;
  newLapses: number | null;
  lapsesWithoutReturn: number | null;
  recovered: number | null;
  subscriptionsNew: number | null;
  subscriptionsCanceled: number | null;
};

type DonorHealthProps = {
  /** janela do relatório em meses (parâmetro `months`) */
  windowMonths: number;
  /** meses sem doar para considerar lapso (parâmetro `lapse_months`) */
  lapseMonths: number;
  /** ordenados do mais antigo para o mais recente */
  months: DonorHealthMonth[];
};

/** Doador fiel = doou em todos os seis meses até o mês indicado (regra da API). */
const LOYALTY_WINDOW_MONTHS = 6;
const KPI_WINDOW_MONTHS = 12;

const MONTH_ABBREVIATIONS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

const EMPTY_VALUE = "–";

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-");
  const abbreviation = MONTH_ABBREVIATIONS[Number(monthNumber) - 1] ?? monthNumber;
  return `${abbreviation}/${year.slice(-2)}`;
}

function previousYearMonth(month: string): string {
  const [year, monthNumber] = month.split("-");
  return `${Number(year) - 1}-${monthNumber}`;
}

function formatInteger(value: number | null): string {
  return value === null ? EMPTY_VALUE : value.toLocaleString("pt-BR");
}

function formatMoney(value: number): string {
  return formatCurrency(String(value));
}

function formatPercent(value: number, signed = false): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return signed && value > 0 ? `+${formatted}%` : `${formatted}%`;
}

function variation(current: number, previous: number | undefined): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function sumNullable(values: (number | null)[]): number | null {
  const known = values.filter((value): value is number => value !== null);
  return known.length ? known.reduce((total, value) => total + value, 0) : null;
}

const NUMBER_WORDS: Record<number, string> = {
  1: "um", 2: "dois", 3: "três", 4: "quatro", 5: "cinco", 6: "seis",
  7: "sete", 8: "oito", 9: "nove", 10: "dez", 11: "onze", 12: "doze",
};

function monthsInWords(count: number): string {
  return `${NUMBER_WORDS[count] ?? count} ${count === 1 ? "mês" : "meses"}`;
}

class DonorHealth {
  readonly windowMonths: number;
  readonly lapseMonths: number;
  readonly months: DonorHealthMonth[];

  private constructor(props: DonorHealthProps) {
    this.windowMonths = props.windowMonths;
    this.lapseMonths = props.lapseMonths;
    this.months = props.months;
  }

  static restore(props: DonorHealthProps): DonorHealth {
    return new DonorHealth(props);
  }

  private get closedMonths(): DonorHealthMonth[] {
    return this.months.filter((month) => !month.isPartial);
  }

  private findMonth(month: string): DonorHealthMonth | undefined {
    return this.months.find((item) => item.month === month);
  }

  private buildLastClosedMonth() {
    const closed = this.closedMonths;
    const last = closed.at(-1);
    if (!last) return null;

    const sameMonthLastYear = this.findMonth(previousYearMonth(last.month));
    const kpiWindow = closed.slice(-KPI_WINDOW_MONTHS);

    const revenueVariation = variation(last.revenueTotal, sameMonthLastYear?.revenueTotal);
    const donorsVariation = variation(last.donors, sameMonthLastYear?.donors);
    const loyalShare =
      last.loyalDonors !== null && last.donors > 0
        ? (last.loyalDonors / last.donors) * 100
        : null;
    const newLapses = sumNullable(kpiWindow.map((month) => month.newLapses));
    const canceled = sumNullable(kpiWindow.map((month) => month.subscriptionsCanceled));

    const revenueTrend = sameMonthLastYear
      ? `A receita mensal ${
          last.revenueTotal < sameMonthLastYear.revenueTotal ? "caiu" : "subiu"
        } de ${formatMoney(sameMonthLastYear.revenueTotal)} em ${formatMonth(
          sameMonthLastYear.month,
        )} para ${formatMoney(last.revenueTotal)} em ${formatMonth(last.month)}.`
      : null;

    return {
      label: formatMonth(last.month),
      revenueTrend,
      kpis: {
        revenue: {
          value: formatMoney(last.revenueTotal),
          variation: revenueVariation,
          caption:
            revenueVariation === null
              ? "Sem dados do mesmo mês do ano anterior"
              : `${formatPercent(revenueVariation, true)} vs. mesmo mês do ano anterior`,
        },
        donors: {
          value: formatInteger(last.donors),
          variation: donorsVariation,
          caption:
            donorsVariation === null
              ? "Sem dados do mesmo mês do ano anterior"
              : `${formatPercent(donorsVariation, true)} vs. mesmo mês do ano anterior`,
        },
        loyalDonors: {
          value: formatInteger(last.loyalDonors),
          caption:
            loyalShare === null ? EMPTY_VALUE : `${formatPercent(loyalShare)} dos doadores do mês`,
        },
        newLapses: {
          value: formatInteger(newLapses),
          caption: `${formatInteger(canceled)} cancelamentos formais no período`,
        },
      },
    };
  }

  toJson() {
    const first = this.months.at(0);
    const last = this.months.at(-1);
    const hasPartialMonth = !!last?.isPartial;

    return {
      windowMonths: this.windowMonths,
      lapseMonths: this.lapseMonths,
      lapseMonthsInWords: monthsInWords(this.lapseMonths),
      loyaltyWindowInWords: monthsInWords(LOYALTY_WINDOW_MONTHS),
      hasPartialMonth,
      periodLabel:
        first && last
          ? `${this.months.length} meses · ${formatMonth(first.month)} a ${formatMonth(last.month)}`
          : "",
      lastClosedMonth: this.buildLastClosedMonth(),
      // séries brutas para os gráficos (o cliente só desenha)
      chart: this.months.map((month) => ({
        label: formatMonth(month.month),
        isPartial: month.isPartial,
        revenueBoleto: month.revenueBoleto,
        revenuePix: month.revenuePix,
        revenueCard: month.revenueCard,
        revenueAutomaticPix: month.revenueAutomaticPix,
        donors: month.donors,
        loyalDonors: month.loyalDonors,
        newLapses: month.newLapses,
        lapsesWithoutReturn: month.lapsesWithoutReturn,
        recovered: month.recovered,
        subscriptionsNew: month.subscriptionsNew,
        subscriptionsCanceled: month.subscriptionsCanceled,
      })),
      // linhas formatadas para a tabela "Dados mensais"
      rows: this.months.map((month) => ({
        month: month.month,
        label: month.isPartial
          ? `${formatMonth(month.month)} (parcial)`
          : formatMonth(month.month),
        revenueTotal: formatMoney(month.revenueTotal),
        revenueBoleto: formatMoney(month.revenueBoleto),
        revenuePix: formatMoney(month.revenuePix),
        revenueCard: formatMoney(month.revenueCard),
        revenueAutomaticPix: formatMoney(month.revenueAutomaticPix),
        donations: formatInteger(month.donations),
        donors: formatInteger(month.donors),
        loyalDonors: formatInteger(month.loyalDonors),
        newLapses: formatInteger(month.newLapses),
        lapsesWithoutReturn: formatInteger(month.lapsesWithoutReturn),
        recovered: formatInteger(month.recovered),
        subscriptionsNew: formatInteger(month.subscriptionsNew),
        subscriptionsCanceled: formatInteger(month.subscriptionsCanceled),
      })),
    };
  }
}

type DonorHealthJson = ReturnType<DonorHealth["toJson"]>;

export { DonorHealth };
export type { DonorHealthJson, DonorHealthMonth, DonorHealthProps };
