import {
  formatDate,
  formatToCnpj,
  formatToCpf,
  formatToCurrency,
  parseToDate,
} from "@arkyn/shared";

type CurrencyType =
  | "USD"
  | "EUR"
  | "JPY"
  | "GBP"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "SEK"
  | "NZD"
  | "BRL"
  | "INR"
  | "RUB"
  | "ZAR"
  | "MXN"
  | "SGD"
  | "HKD"
  | "NOK"
  | "KRW"
  | "TRY"
  | "IDR"
  | "THB";

type FormatCurrencyProps = {
  amount: number;
  outputFormat: CurrencyType;
};

class FormatAdapter {
  static cpf(cpf: string): string {
    return formatToCpf(cpf.trim());
  }

  static cnpj(cnpj: string): string {
    return formatToCnpj(cnpj);
  }

  static cpfCnpj(cpfCnpj: string): string {
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length === 11) return formatToCpf(digits);
    if (digits.length === 14) return formatToCnpj(digits);
    return cpfCnpj;
  }

  static date(date: Date): string {
    return formatDate(date.toISOString().split("T"), "isoDate", "DD/MM/YYYY");
  }

  static currency(input: FormatCurrencyProps): string {
    return formatToCurrency(input.amount, input.outputFormat);
  }

  static parseToDate(dateString: string): Date {
    return parseToDate(dateString.split("T"), "brazilianDate");
  }
}

export { FormatAdapter, type CurrencyType };
