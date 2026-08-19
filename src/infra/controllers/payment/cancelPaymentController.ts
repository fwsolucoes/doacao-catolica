import type { CancelPaymentUseCase } from "~/app/useCases/payment/cancelPaymentUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { cancelPaymentBodySchema } from "~/infra/schemas/internal/payment";
import type { RouteDTO } from "~/main/types/route";

class CancelPaymentController {
  constructor(private cancelPaymentUseCase: CancelPaymentUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(cancelPaymentBodySchema).validate(body);

    await this.cancelPaymentUseCase.execute(campaignId, validated.paymentId);

    return {
      toast: { message: "Pagamento cancelado com sucesso!", type: "success" as const },
    };
  }
}

export { CancelPaymentController };
