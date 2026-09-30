import type { MonthlyDonorsSearchParams } from "~/app/search/monthlyDonorsSearchParams";
import { MonthlyDonors } from "~/domain/entities/monthlyDonors";
import type { MonthlyDonorsGatewayDTO } from "~/domain/gateways/monthlyDonors";
import type { MonthlyDonorsJson } from "~/domain/entities/monthlyDonors";

type MockDonor = {
  customerId: number;
  customerUuid: string;
  name: string;
  document: string;
  phone: string;
  paymentMethod: string;
  campaignName: string;
  baseAmount: number;
};

const MOCK_DONORS: MockDonor[] = [
  { customerId: 1, customerUuid: "c1", name: "Marcos Vinícius Teixeira", document: "123.456.789-01", phone: "+5511988712245", paymentMethod: "pix_automatico", campaignName: "Dízimo Paróquia São José", baseAmount: 40 },
  { customerId: 2, customerUuid: "c2", name: "Rita de Cássia Almeida", document: "987.654.321-09", phone: "+5521991208834", paymentMethod: "cartao_credito", campaignName: "Dízimo Paróquia São José", baseAmount: 100 },
  { customerId: 3, customerUuid: "c3", name: "José Antônio Ribeiro", document: "456.123.789-22", phone: "+5531984551190", paymentMethod: "boleto", campaignName: "Campanha Natal Solidário", baseAmount: 130 },
  { customerId: 4, customerUuid: "c4", name: "Sandra Maria Lopes", document: "321.654.987-44", phone: "+5541996774412", paymentMethod: "pix", campaignName: "Campanha Natal Solidário", baseAmount: 80 },
  { customerId: 5, customerUuid: "c5", name: "Paulo Henrique Costa", document: "159.753.486-07", phone: "+5551983307761", paymentMethod: "cartao_credito", campaignName: "Reforma da Capela", baseAmount: 120 },
  { customerId: 6, customerUuid: "c6", name: "Célia Fernandes", document: "753.951.258-63", phone: "+5561982143387", paymentMethod: "pix", campaignName: "Reforma da Capela", baseAmount: 60 },
  { customerId: 7, customerUuid: "c7", name: "Roberto Carlos Dias", document: "852.741.963-10", phone: "+5585995026673", paymentMethod: "boleto", campaignName: "Dízimo Paróquia São José", baseAmount: 100 },
  { customerId: 8, customerUuid: "c8", name: "Adriana Nogueira", document: "951.357.842-20", phone: "+5571993217788", paymentMethod: "pix_automatico", campaignName: "Campanha Natal Solidário", baseAmount: 140 },
  { customerId: 9, customerUuid: "c9", name: "Fernando Augusto Melo", document: "741.852.963-55", phone: "+5581994456622", paymentMethod: "cartao_credito", campaignName: "Reforma da Capela", baseAmount: 90 },
  { customerId: 10, customerUuid: "c10", name: "Luciana Barbosa Silva", document: "258.369.147-88", phone: "+5511987654321", paymentMethod: "pix", campaignName: "Dízimo Paróquia São José", baseAmount: 70 },
  { customerId: 11, customerUuid: "c11", name: "Carlos Eduardo Santos", document: "369.258.147-33", phone: "+5521998877665", paymentMethod: "boleto", campaignName: "Campanha Natal Solidário", baseAmount: 110 },
  { customerId: 12, customerUuid: "c12", name: "Juliana Pereira Costa", document: "147.258.369-99", phone: "+5531976543210", paymentMethod: "pix_automatico", campaignName: "Reforma da Capela", baseAmount: 50 },
];

function listMonthsBetween(startMonth: string, endMonth: string): string[] {
  const [startYear, startMonthNumber] = startMonth.split("-").map(Number);
  const [endYear, endMonthNumber] = endMonth.split("-").map(Number);
  if (!startYear || !startMonthNumber || !endYear || !endMonthNumber) return [];

  const months: string[] = [];
  let year = startYear;
  let month = startMonthNumber;

  while (year < endYear || (year === endYear && month <= endMonthNumber)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return months;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildMonthlyAmounts(
  donor: MockDonor,
  months: string[],
): { amounts: Record<string, number | null>; total: number } {
  const amounts: Record<string, number | null> = {};
  let total = 0;

  months.forEach((month, index) => {
    const skip = pseudoRandom(donor.customerId * 31 + index) < 0.25;
    if (skip) {
      amounts[month] = null;
      return;
    }
    const variation = Math.floor(pseudoRandom(donor.customerId * 17 + index) * 5) * 10;
    const amount = donor.baseAmount + variation;
    amounts[month] = amount;
    total += amount;
  });

  return { amounts, total };
}

// Endpoint GET /donation/monthly-donors ainda não está disponível no backend;
// esta implementação retorna dados mockados até ele ficar pronto.
class MonthlyDonorsGateway implements MonthlyDonorsGatewayDTO {
  async getMonthlyDonors(
    searchParams: MonthlyDonorsSearchParams,
  ): Promise<MonthlyDonorsJson> {
    const filter = searchParams.filter;
    const months = listMonthsBetween(
      filter?.start_month ?? "",
      filter?.end_month ?? "",
    );

    const search = filter?.search?.toLowerCase();
    const name = filter?.name?.toLowerCase();
    const cpf = filter?.cpf?.replace(/\D/g, "");

    const filtered = MOCK_DONORS.filter((donor) => {
      if (search) {
        const haystack = `${donor.name} ${donor.document} ${donor.phone}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (name && !donor.name.toLowerCase().includes(name)) return false;
      if (cpf && !donor.document.replace(/\D/g, "").includes(cpf)) return false;
      return true;
    });

    const page = searchParams.page;
    const pageLimit = searchParams.pageLimit;
    const start = (page - 1) * pageLimit;
    const paginated = filtered.slice(start, start + pageLimit);

    const donors = paginated.map((donor) => {
      const { amounts, total } = buildMonthlyAmounts(donor, months);
      return {
        customerId: donor.customerId,
        customerUuid: donor.customerUuid,
        name: donor.name,
        document: donor.document,
        phone: donor.phone,
        paymentMethod: donor.paymentMethod,
        campaignName: donor.campaignName,
        monthlyAmounts: amounts,
        totalAmount: total,
      };
    });

    return MonthlyDonors.restore({
      months,
      donors,
      page,
      pageLimit,
      totalItems: filtered.length,
    }).toJson();
  }
}

export { MonthlyDonorsGateway };
