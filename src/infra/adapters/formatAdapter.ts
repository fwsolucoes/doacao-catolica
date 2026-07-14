import {
  formatDate,
  formatToCnpj,
  formatToCpf,
  formatToCurrency,
  formatToPhone,
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

  static phone(phone: string | null): string | null {
    if (!phone) return null;
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("5555") && digits.length > 13) digits = digits.slice(2);
    const normalized =
      digits.startsWith("55") && digits.length > 11
        ? `+${digits}`
        : `+55${digits}`;
    try {
      return formatToPhone(normalized);
    } catch {
      return phone;
    }
  }

  static cpfCnpj(cpfCnpj: string | null): string | null {
    if (!cpfCnpj) return null;
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
