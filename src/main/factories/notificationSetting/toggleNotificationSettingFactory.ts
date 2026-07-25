import { ToggleNotificationSettingUseCase } from "~/app/useCases/notificationSetting/toggleNotificationSettingUseCase";
import { ToggleNotificationSettingController } from "~/infra/controllers/notificationSetting/toggleNotificationSettingController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const toggleNotificationSettingUseCase = new ToggleNotificationSettingUseCase(
  notificationSettingGateway,
);
const toggleNotificationSettingController = new ToggleNotificationSettingController(
  toggleNotificationSettingUseCase,
);

const toggleNotificationSetting = {
  handle: toggleNotificationSettingController.handle.bind(
    toggleNotificationSettingController,
  ),
};

export { toggleNotificationSetting };
