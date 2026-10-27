import type { CreateOneTimePaymentUseCase } from "~/app/useCases/createOneTimePayment/createOneTimePaymentUseCase";
import type { RegisterOfflinePaymentUseCase } from "~/app/useCases/createOneTimePayment/registerOfflinePaymentUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { oneTimePaymentSchema } from "~/infra/schemas/internal/oneTimePayment";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateOneTimePaymentController {
  constructor(
    private createOneTimePaymentUseCase: CreateOneTimePaymentUseCase,
    private registerOfflinePaymentUseCase: RegisterOfflinePaymentUseCase,
  ) {}

  // returns the payment uuid for online payments, null for offline ones
  async handle(route: RouteDTO): Promise<string | null> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(oneTimePaymentSchema);
    const validatedBody = schemaValidator.validate(body);

    const contact = {
      contactId: validatedBody.contactId,
      contactName: validatedBody.contactName,
      contactEmail: validatedBody.contactEmail,
      contactPhone: validatedBody.contactPhone,
      contactCpf: validatedBody.contactCpf,
      contactBirthDate: validatedBody.contactBirthDate,
      missingFields: validatedBody.missingFields,
      accountId: validatedBody.accountId,
      campaignId,
      category: validatedBody.category,
      token: user.token,
    };

    if (validatedBody.paymentOption === "onlinePayment") {
      return await this.createOneTimePaymentUseCase.execute({
        ...contact,
        paymentType: validatedBody.paymentType!,
        amount: validatedBody.amount!,
      });
    }

    await this.registerOfflinePaymentUseCase.execute({
      ...contact,
      amount: validatedBody.amount!,
      paymentDate: validatedBody.paymentDate,
      method: validatedBody.method!,
      bankAccount: validatedBody.bankAccount,
      observations: validatedBody.observations,
    });

    return null;
  }
}

export { CreateOneTimePaymentController };
