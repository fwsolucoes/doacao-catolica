import { CreateNotificationSettingUseCase } from "~/app/useCases/notificationSetting/createNotificationSettingUseCase";
import { CreateNotificationSettingController } from "~/infra/controllers/notificationSetting/createNotificationSettingController";
import { NotificationSettingGateway } from "~/infra/gateways/notificationSetting";

const notificationSettingGateway = new NotificationSettingGateway();
const createNotificationSettingUseCase = new CreateNotificationSettingUseCase(
  notificationSettingGateway,
);
const createNotificationSettingController =
  new CreateNotificationSettingController(createNotificationSettingUseCase);

const createNotificationSetting = {
  handle: createNotificationSettingController.handle.bind(
    createNotificationSettingController,
  ),
};

export { createNotificationSetting };
