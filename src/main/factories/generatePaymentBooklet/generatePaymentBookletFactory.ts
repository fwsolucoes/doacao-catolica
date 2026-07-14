import { GeneratePaymentBookletUseCase } from "~/app/useCases/generatePaymentBooklet/generatePaymentBookletUseCase";
import { GeneratePaymentBookletController } from "~/infra/controllers/generatePaymentBooklet/generatePaymentBookletController";
import { PaymentBookletGateway } from "~/infra/gateways/paymentBooklet";

const paymentBookletGateway = new PaymentBookletGateway();
const generatePaymentBookletUseCase = new GeneratePaymentBookletUseCase(
  paymentBookletGateway,
);
const generatePaymentBookletController = new GeneratePaymentBookletController(
  generatePaymentBookletUseCase,
);

const generatePaymentBooklet = {
  handle: generatePaymentBookletController.handle.bind(
    generatePaymentBookletController,
  ),
};

export { generatePaymentBooklet };
