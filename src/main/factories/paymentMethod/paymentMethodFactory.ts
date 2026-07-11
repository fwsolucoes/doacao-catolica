import { ListPaymentMethodsUseCase } from "~/app/useCases/paymentMethod/listPaymentMethodsUseCase";
import { CreatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/createPaymentMethodUseCase";
import { UpdatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/updatePaymentMethodUseCase";
import { DeletePaymentMethodUseCase } from "~/app/useCases/paymentMethod/deletePaymentMethodUseCase";
import { PaymentMethodGateway } from "~/infra/gateways/paymentMethod";
import { PaymentMethodController } from "~/infra/controllers/paymentMethod/paymentMethodController";

const gateway = new PaymentMethodGateway();
const controller = new PaymentMethodController(
  new ListPaymentMethodsUseCase(gateway),
  new CreatePaymentMethodUseCase(gateway),
  new UpdatePaymentMethodUseCase(gateway),
  new DeletePaymentMethodUseCase(gateway),
);

const paymentMethodFactory = {
  handleLoader: controller.handleLoader.bind(controller),
  handleAction: controller.handleAction.bind(controller),
};

export { paymentMethodFactory };
