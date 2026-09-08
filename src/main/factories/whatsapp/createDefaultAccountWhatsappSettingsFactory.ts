import { CreateDefaultAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/createDefaultAccountWhatsappSettingsUseCase";
import { CreateDefaultAccountWhatsappSettingsController } from "~/infra/controllers/whatsapp/createDefaultAccountWhatsappSettingsController";
import { AccountWhatsappSettingsGateway } from "~/infra/gateways/accountWhatsappSettings";

const accountWhatsappSettingsGateway = new AccountWhatsappSettingsGateway();
const createDefaultAccountWhatsappSettingsUseCase =
  new CreateDefaultAccountWhatsappSettingsUseCase(
    accountWhatsappSettingsGateway,
  );
const createDefaultAccountWhatsappSettingsController =
  new CreateDefaultAccountWhatsappSettingsController(
    createDefaultAccountWhatsappSettingsUseCase,
  );

const createDefaultAccountWhatsappSettings = {
  handle: createDefaultAccountWhatsappSettingsController.handle.bind(
    createDefaultAccountWhatsappSettingsController,
  ),
};

export { createDefaultAccountWhatsappSettings };
