import { ListPaymentNotificationsUseCase } from "~/app/useCases/paymentNotification/listPaymentNotificationsUseCase";
import { ListPaymentNotificationsController } from "~/infra/controllers/paymentNotification/listPaymentNotificationsController";
import { PaymentNotificationGateway } from "~/infra/gateways/paymentNotification";

const paymentNotificationGateway = new PaymentNotificationGateway();
const listPaymentNotificationsUseCase = new ListPaymentNotificationsUseCase(
  paymentNotificationGateway,
);
const listPaymentNotificationsController = new ListPaymentNotificationsController(
  listPaymentNotificationsUseCase,
);

const listPaymentNotifications = {
  handle: listPaymentNotificationsController.handle.bind(
    listPaymentNotificationsController,
  ),
};

export { listPaymentNotifications };
