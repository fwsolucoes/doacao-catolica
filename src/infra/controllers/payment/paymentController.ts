import type { CancelPaymentUseCase } from "~/app/useCases/payment/cancelPaymentUseCase";
import type { ManualPaymentUseCase } from "~/app/useCases/payment/manualPaymentUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import {
  cancelPaymentBodySchema,
  manualPaymentBodySchema,
} from "~/infra/schemas/internal/payment";
import type { RouteDTO } from "~/main/types/route";

class PaymentController {
  constructor(
    private cancelPaymentUseCase: CancelPaymentUseCase,
    private manualPaymentUseCase: ManualPaymentUseCase,
  ) {}

  async handleAction(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    switch (body._action) {
      case "cancelPayment": {
        const validated = new SchemaValidatorAdapter(cancelPaymentBodySchema).validate(body);
        await this.cancelPaymentUseCase.execute(campaignId, validated.paymentId);
        return {
          toast: { message: "Pagamento cancelado com sucesso!", type: "success" as const },
        };
      }
      case "manualPayment": {
        const validated = new SchemaValidatorAdapter(manualPaymentBodySchema).validate(body);
        await this.manualPaymentUseCase.execute(campaignId, {
          paymentId: validated.paymentId,
          amount: validated.amount,
          paymentDate: validated.paymentDate,
          methodId: validated.methodId,
          bankAccount: validated.bankAccount,
          observations: validated.observations,
        });
        return {
          toast: { message: "Baixa manual realizada com sucesso!", type: "success" as const },
        };
      }
      default:
        throw HttpAdapter.badRequest("Ação inválida");
    }
  }
}

export { PaymentController };
