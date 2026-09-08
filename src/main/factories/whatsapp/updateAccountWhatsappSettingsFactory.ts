import { UpdateAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/updateAccountWhatsappSettingsUseCase";
import { UpdateAccountWhatsappSettingsController } from "~/infra/controllers/whatsapp/updateAccountWhatsappSettingsController";
import { AccountWhatsappSettingsGateway } from "~/infra/gateways/accountWhatsappSettings";

const accountWhatsappSettingsGateway = new AccountWhatsappSettingsGateway();
const updateAccountWhatsappSettingsUseCase =
  new UpdateAccountWhatsappSettingsUseCase(accountWhatsappSettingsGateway);
const updateAccountWhatsappSettingsController =
  new UpdateAccountWhatsappSettingsController(
    updateAccountWhatsappSettingsUseCase,
  );

const updateAccountWhatsappSettings = {
  handle: updateAccountWhatsappSettingsController.handle.bind(
    updateAccountWhatsappSettingsController,
  ),
};

export { updateAccountWhatsappSettings };
