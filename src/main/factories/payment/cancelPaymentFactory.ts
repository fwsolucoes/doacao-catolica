import { CancelPaymentUseCase } from "~/app/useCases/payment/cancelPaymentUseCase";
import { CancelPaymentController } from "~/infra/controllers/payment/cancelPaymentController";
import { PaymentGateway } from "~/infra/gateways/payment";

const gateway = new PaymentGateway();
const useCase = new CancelPaymentUseCase(gateway);
const controller = new CancelPaymentController(useCase);

const cancelPayment = {
  handle: controller.handle.bind(controller),
};

export { cancelPayment };
