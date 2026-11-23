import { CancelManualPaymentUseCase } from "~/app/useCases/payment/cancelManualPaymentUseCase";
import { CancelPaymentUseCase } from "~/app/useCases/payment/cancelPaymentUseCase";
import { ManualPaymentUseCase } from "~/app/useCases/payment/manualPaymentUseCase";
import { RetryPaymentUseCase } from "~/app/useCases/payment/retryPaymentUseCase";
import { SendReminderNotificationUseCase } from "~/app/useCases/payment/sendReminderNotificationUseCase";
import { PaymentController } from "~/infra/controllers/payment/paymentController";
import { PaymentGateway } from "~/infra/gateways/payment";

const gateway = new PaymentGateway();
const controller = new PaymentController(
  new CancelPaymentUseCase(gateway),
  new ManualPaymentUseCase(gateway),
  new SendReminderNotificationUseCase(gateway),
  new CancelManualPaymentUseCase(gateway),
  new RetryPaymentUseCase(gateway),
);

const paymentFactory = {
  handleAction: controller.handleAction.bind(controller),
};

export { paymentFactory };
