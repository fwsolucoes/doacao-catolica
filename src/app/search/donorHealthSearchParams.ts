import { SearchParams } from "../shared/searchParams";

type Filter = {
  /** janela do relatório em meses */
  months: number;
  /** meses sem doar para considerar lapso */
  lapse_months: number;
  /** 1 força o download do PDF (só na rota de exportação) */
  download?: number;
};

class DonorHealthSearchParams extends SearchParams<Filter> {}

export { DonorHealthSearchParams };
