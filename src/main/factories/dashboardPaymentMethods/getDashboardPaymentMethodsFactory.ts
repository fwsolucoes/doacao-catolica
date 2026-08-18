import { GetDashboardPaymentMethodsUseCase } from "~/app/useCases/dashboardPaymentMethods/getDashboardPaymentMethodsUseCase";
import { DashboardPaymentMethodsGateway } from "~/infra/gateways/dashboardPaymentMethods";

const dashboardPaymentMethodsGateway = new DashboardPaymentMethodsGateway();
const getDashboardPaymentMethodsUseCase = new GetDashboardPaymentMethodsUseCase(
  dashboardPaymentMethodsGateway,
);

const getDashboardPaymentMethods = {
  handle: (accountUuid: string, month?: number, year?: number) =>
    getDashboardPaymentMethodsUseCase.execute({ accountUuid, month, year }),
};

export { getDashboardPaymentMethods };
