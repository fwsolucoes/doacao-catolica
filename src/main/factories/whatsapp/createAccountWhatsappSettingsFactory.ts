import { CreateAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/createAccountWhatsappSettingsUseCase";
import { CreateAccountWhatsappSettingsController } from "~/infra/controllers/whatsapp/createAccountWhatsappSettingsController";
import { AccountWhatsappSettingsGateway } from "~/infra/gateways/accountWhatsappSettings";

const accountWhatsappSettingsGateway = new AccountWhatsappSettingsGateway();
const createAccountWhatsappSettingsUseCase =
  new CreateAccountWhatsappSettingsUseCase(accountWhatsappSettingsGateway);
const createAccountWhatsappSettingsController =
  new CreateAccountWhatsappSettingsController(
    createAccountWhatsappSettingsUseCase,
  );

const createAccountWhatsappSettings = {
  handle: createAccountWhatsappSettingsController.handle.bind(
    createAccountWhatsappSettingsController,
  ),
};

export { createAccountWhatsappSettings };
