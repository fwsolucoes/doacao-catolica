import { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { ListPaymentsUseCase } from "~/app/useCases/paymentMetrics/listPaymentsUseCase";
import { GetPaymentMetricsController } from "~/infra/controllers/paymentMetrics/getPaymentMetricsController";
import { ListPaymentsController } from "~/infra/controllers/paymentMetrics/listPaymentsController";
import { PaymentMetricsGateway } from "~/infra/gateways/paymentMetrics";

const paymentMetricsGateway = new PaymentMetricsGateway();

const getPaymentMetricsUseCase = new GetPaymentMetricsUseCase(paymentMetricsGateway);
const getPaymentMetricsController = new GetPaymentMetricsController(getPaymentMetricsUseCase);

const listPaymentsUseCase = new ListPaymentsUseCase(paymentMetricsGateway);
const listPaymentsController = new ListPaymentsController(listPaymentsUseCase);

const getPaymentMetrics = {
  handle: getPaymentMetricsController.handle.bind(getPaymentMetricsController),
};

const listPayments = {
  handle: listPaymentsController.handle.bind(listPaymentsController),
};

export { getPaymentMetrics, listPayments };
