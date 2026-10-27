import { CreateOneTimePaymentUseCase } from "~/app/useCases/createOneTimePayment/createOneTimePaymentUseCase";
import { RegisterOfflinePaymentUseCase } from "~/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase";
import { CreateOneTimePaymentController } from "~/infra/controllers/createOneTimePayment/createOneTimePaymentController";
import { ContactGateway } from "~/infra/gateways/contact";
import { DonorGateway } from "~/infra/gateways/donor";
import { OneTimePaymentGateway } from "~/infra/gateways/oneTimePayment";
import { PaymentGateway } from "~/infra/gateways/payment";

const contactGateway = new ContactGateway();
const donorGateway = new DonorGateway();
const oneTimePaymentGateway = new OneTimePaymentGateway();
const paymentGateway = new PaymentGateway();

const createOneTimePaymentUseCase = new CreateOneTimePaymentUseCase(
  contactGateway,
  donorGateway,
  oneTimePaymentGateway,
);
const registerOfflinePaymentUseCase = new RegisterOfflinePaymentUseCase(
  createOneTimePaymentUseCase,
  paymentGateway,
);
const createOneTimePaymentController = new CreateOneTimePaymentController(
  createOneTimePaymentUseCase,
  registerOfflinePaymentUseCase,
);

const createOneTimePayment = {
  handle: createOneTimePaymentController.handle.bind(
    createOneTimePaymentController,
  ),
};

export { createOneTimePayment };
