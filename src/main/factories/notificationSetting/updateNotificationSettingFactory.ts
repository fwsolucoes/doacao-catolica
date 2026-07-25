import { UpdateNotificationSettingUseCase } from "~/app/useCases/notificationSetting/updateNotificationSettingUseCase";
import { UpdateNotificationSettingController } from "~/infra/controllers/notificationSetting/updateNotificationSettingController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const updateNotificationSettingUseCase = new UpdateNotificationSettingUseCase(
  notificationSettingGateway,
);
const updateNotificationSettingController =
  new UpdateNotificationSettingController(updateNotificationSettingUseCase);

const updateNotificationSetting = {
  handle: updateNotificationSettingController.handle.bind(
    updateNotificationSettingController,
  ),
};

export { updateNotificationSetting };
