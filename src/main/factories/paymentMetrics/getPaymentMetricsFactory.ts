import { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { GetPaymentMetricsController } from "~/infra/controllers/paymentMetrics/getPaymentMetricsController";
import { PaymentMetricsGateway } from "~/infra/gateways/paymentMetrics";

const paymentMetricsGateway = new PaymentMetricsGateway();
const getPaymentMetricsUseCase = new GetPaymentMetricsUseCase(paymentMetricsGateway);
const getPaymentMetricsController = new GetPaymentMetricsController(getPaymentMetricsUseCase);

const getPaymentMetrics = {
  handle: getPaymentMetricsController.handle.bind(getPaymentMetricsController),
};

export { getPaymentMetrics };
