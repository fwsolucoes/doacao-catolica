import { ListNotificationSettingsUseCase } from "~/app/useCases/notificationSetting/listNotificationSettingsUseCase";
import { ListNotificationSettingsController } from "~/infra/controllers/notificationSetting/listNotificationSettingsController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const listNotificationSettingsUseCase = new ListNotificationSettingsUseCase(
  notificationSettingGateway,
);
const listNotificationSettingsController =
  new ListNotificationSettingsController(listNotificationSettingsUseCase);

const listNotificationSettings = {
  handle: listNotificationSettingsController.handle.bind(
    listNotificationSettingsController,
  ),
};

export { listNotificationSettings };
