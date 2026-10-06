import { MonthlyDonorsSearchParams } from "~/app/search/monthlyDonorsSearchParams";
import type { MonthlyDonorsGatewayDTO } from "~/domain/gateways/monthlyDonors";

type InputProps = {
  startMonth?: string;
  endMonth?: string;
  projectId?: string;
  projectAccountId?: string;
  search?: string;
  name?: string;
  cpf?: string;
  page?: number;
};

const PAGE_LIMIT = 10;

function monthString(offset: number): string {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

class GetMonthlyDonorsUseCase {
  constructor(private gateway: MonthlyDonorsGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      startMonth,
      endMonth,
      projectId,
      projectAccountId,
      search,
      name,
      cpf,
      page,
    } = input;

    const searchParams = new MonthlyDonorsSearchParams({
      page: page ?? 1,
      pageLimit: PAGE_LIMIT,
      filter: {
        start_month: startMonth ?? monthString(11),
        end_month: endMonth ?? monthString(0),
        project_id: projectId,
        project_account_id: projectAccountId,
        search,
        name,
        cpf,
        per_page: PAGE_LIMIT,
      },
    });

    return this.gateway.getMonthlyDonors(searchParams);
  }
}

export { GetMonthlyDonorsUseCase };
