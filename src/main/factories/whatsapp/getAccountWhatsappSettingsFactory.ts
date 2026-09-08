import { GetAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/getAccountWhatsappSettingsUseCase";
import { GetAccountWhatsappSettingsController } from "~/infra/controllers/whatsapp/getAccountWhatsappSettingsController";
import { AccountWhatsappSettingsGateway } from "~/infra/gateways/accountWhatsappSettings";

const accountWhatsappSettingsGateway = new AccountWhatsappSettingsGateway();
const getAccountWhatsappSettingsUseCase = new GetAccountWhatsappSettingsUseCase(
  accountWhatsappSettingsGateway,
);
const getAccountWhatsappSettingsController =
  new GetAccountWhatsappSettingsController(getAccountWhatsappSettingsUseCase);

const getAccountWhatsappSettings = {
  handle: getAccountWhatsappSettingsController.handle.bind(
    getAccountWhatsappSettingsController,
  ),
};

export { getAccountWhatsappSettings };
