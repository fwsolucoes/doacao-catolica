import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

/**
 * Paleta validada (dataviz/validate_palette, modo claro): mantém os matizes do Figma,
 * com Pix/Cartão escurecidos para contraste e "Recuperados" em azul para não depender
 * da dupla vermelho × verde (deuteranopia).
 */
const SERIES_COLORS = {
  boleto: "#4B3F9E",
  pix: "#B7791F",
  card: "#2FC48D",
  automaticPix: "#C4506B",
  donors: "#4B3F9E",
  loyalDonors: "#2FC48D",
  newLapses: "#B8402F",
  withoutReturn: "#7E2A6B",
  recovered: "#1D7AA8",
  subscriptionsNew: "#4B3F9E",
  subscriptionsCanceled: "#B8402F",
} as const;

const GRID_COLOR = "rgba(0,0,0,0.06)";
const TICK_FONT = { size: 11 };

const integerFormatter = new Intl.NumberFormat("pt-BR");
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 0,
});

/** cor com transparência para o mês parcial (ainda não fechado) */
function withAlpha(hex: string, alpha: number): string {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: {
    // legenda em HTML (ChartLegend) para seguir o layout do Figma
    legend: { display: false },
  },
};

export {
  BASE_OPTIONS,
  compactCurrencyFormatter,
  currencyFormatter,
  GRID_COLOR,
  integerFormatter,
  SERIES_COLORS,
  TICK_FONT,
  withAlpha,
};
