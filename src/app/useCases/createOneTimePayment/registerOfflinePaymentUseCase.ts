import type { PaymentGatewayDTO } from "~/domain/gateways/payment";
import type {
  CreateOneTimePaymentInput,
  CreateOneTimePaymentUseCase,
} from "./createOneTimePaymentUseCase";

type RegisterOfflinePaymentInput = Omit<
  CreateOneTimePaymentInput,
  "paymentType"
> & {
  paymentDate: string;
  method: string;
  bankAccount?: string;
  observations?: string;
};

class RegisterOfflinePaymentUseCase {
  constructor(
    private createOneTimePaymentUseCase: CreateOneTimePaymentUseCase,
    private paymentGateway: PaymentGatewayDTO,
  ) {}

  async execute(input: RegisterOfflinePaymentInput): Promise<void> {
    const { paymentDate, method, bankAccount, observations, ...payment } =
      input;

    // the payment already happened outside the platform: create it as pix and settle it manually right away
    const paymentId = await this.createOneTimePaymentUseCase.execute({
      ...payment,
      paymentType: "pix",
    });

    await this.paymentGateway.manualPayment(input.campaignId, {
      paymentId,
      amount: input.amount,
      paymentDate,
      methodId: method,
      bankAccount,
      observations,
    });
  }
}

export { RegisterOfflinePaymentUseCase, type RegisterOfflinePaymentInput };
