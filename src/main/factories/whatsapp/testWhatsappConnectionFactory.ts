import { TestWhatsappConnectionUseCase } from "~/app/useCases/whatsapp/testWhatsappConnectionUseCase";
import { TestWhatsappConnectionController } from "~/infra/controllers/whatsapp/testWhatsappConnectionController";
import { WhatsappConnectionGateway } from "~/infra/gateways/whatsappConnection";

const whatsappConnectionGateway = new WhatsappConnectionGateway();
const testWhatsappConnectionUseCase = new TestWhatsappConnectionUseCase(
  whatsappConnectionGateway,
);
const testWhatsappConnectionController = new TestWhatsappConnectionController(
  testWhatsappConnectionUseCase,
);

const testWhatsappConnection = {
  handle: testWhatsappConnectionController.handle.bind(
    testWhatsappConnectionController,
  ),
};

export { testWhatsappConnection };
