import { MonthlyDonorsSearchParams } from "~/app/search/monthlyDonorsSearchParams";
import type { MonthlyDonorsGatewayDTO } from "~/domain/gateways/monthlyDonors";

type InputProps = {
  accountUuid?: string;
  startMonth?: string;
  endMonth?: string;
  projectId?: string;
  projectAccountId?: string;
  search?: string;
  name?: string;
  cpf?: string;
  page?: number;
};

function monthString(offset: number): string {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

class GetMonthlyDonorsUseCase {
  constructor(private gateway: MonthlyDonorsGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      accountUuid,
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
      filter: {
        account_uuid: accountUuid,
        start_month: startMonth ?? monthString(11),
        end_month: endMonth ?? monthString(0),
        project_id: projectId,
        project_account_id: projectAccountId,
        search,
        name,
        cpf,
      },
    });

    return this.gateway.getMonthlyDonors(searchParams);
  }
}

export { GetMonthlyDonorsUseCase };
