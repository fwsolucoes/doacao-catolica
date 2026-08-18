import { DashboardPaymentMethodsSearchParams } from "~/app/search/dashboardPaymentMethodsSearchParams";
import type { DashboardPaymentMethodsGatewayDTO } from "~/domain/gateways/dashboardPaymentMethods";

type InputProps = {
  accountUuid: string;
  month?: number;
  year?: number;
};

class GetDashboardPaymentMethodsUseCase {
  constructor(private gateway: DashboardPaymentMethodsGatewayDTO) {}

  async execute({ accountUuid, month, year }: InputProps) {
    const searchParams = new DashboardPaymentMethodsSearchParams({
      filter: { month, year },
    });

    return await this.gateway.getPaymentMethods(accountUuid, searchParams);
  }
}

export { GetDashboardPaymentMethodsUseCase };
