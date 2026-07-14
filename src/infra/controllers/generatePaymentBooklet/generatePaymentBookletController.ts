import type { GeneratePaymentBookletUseCase } from "~/app/useCases/generatePaymentBooklet/generatePaymentBookletUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { generatePaymentBookletSchema } from "~/infra/schemas/internal/paymentBooklet";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GeneratePaymentBookletController {
  constructor(
    private generatePaymentBookletUseCase: GeneratePaymentBookletUseCase,
  ) {}

  async handle(route: RouteDTO): Promise<string> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(
      generatePaymentBookletSchema,
    );
    const validatedBody = schemaValidator.validate(body);

    return await this.generatePaymentBookletUseCase.execute({
      accountReference: campaignId,
      subscriptionUuid: validatedBody.subscriptionUuid,
      startDate: validatedBody.startDate,
      endDate: validatedBody.endDate,
    });
  }
}

export { GeneratePaymentBookletController };
