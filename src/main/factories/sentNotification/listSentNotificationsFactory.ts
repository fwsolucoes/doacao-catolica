import { ListSentNotificationsUseCase } from "~/app/useCases/sentNotification/listSentNotificationsUseCase";
import { ListSentNotificationsController } from "~/infra/controllers/sentNotification/listSentNotificationsController";
import { SentNotificationGateway } from "~/infra/gateways/sentNotification";

const sentNotificationGateway = new SentNotificationGateway();
const listSentNotificationsUseCase = new ListSentNotificationsUseCase(
  sentNotificationGateway,
);
const listSentNotificationsController = new ListSentNotificationsController(
  listSentNotificationsUseCase,
);

const listSentNotifications = {
  handle: listSentNotificationsController.handle.bind(
    listSentNotificationsController,
  ),
};

export { listSentNotifications };
