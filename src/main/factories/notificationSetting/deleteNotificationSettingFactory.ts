import { DeleteNotificationSettingUseCase } from "~/app/useCases/notificationSetting/deleteNotificationSettingUseCase";
import { DeleteNotificationSettingController } from "~/infra/controllers/notificationSetting/deleteNotificationSettingController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const deleteNotificationSettingUseCase = new DeleteNotificationSettingUseCase(
  notificationSettingGateway,
);
const deleteNotificationSettingController = new DeleteNotificationSettingController(
  deleteNotificationSettingUseCase,
);

const deleteNotificationSetting = {
  handle: deleteNotificationSettingController.handle.bind(
    deleteNotificationSettingController,
  ),
};

export { deleteNotificationSetting };
