import type { ListPaymentMethodsUseCase } from "~/app/useCases/paymentMethod/listPaymentMethodsUseCase";
import type { CreatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/createPaymentMethodUseCase";
import type { UpdatePaymentMethodUseCase } from "~/app/useCases/paymentMethod/updatePaymentMethodUseCase";
import type { DeletePaymentMethodUseCase } from "~/app/useCases/paymentMethod/deletePaymentMethodUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import {
  createPaymentMethodBodySchema,
  updatePaymentMethodBodySchema,
  deletePaymentMethodBodySchema,
} from "~/infra/schemas/internal/paymentMethod";
import type { RouteDTO } from "~/main/types/route";

class PaymentMethodController {
  constructor(
    private listUseCase: ListPaymentMethodsUseCase,
    private createUseCase: CreatePaymentMethodUseCase,
    private updateUseCase: UpdatePaymentMethodUseCase,
    private deleteUseCase: DeletePaymentMethodUseCase,
  ) {}

  async handleLoader(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const paymentMethods = await this.listUseCase.execute(campaignId);
    return { paymentMethods: paymentMethods.map((pm) => pm.toJson()) };
  }

  async handleAction(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    switch (body._action) {
      case "createPaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          createPaymentMethodBodySchema,
        ).validate(body);
        await this.createUseCase.execute(validated.name, campaignId);
        return {
          toast: { message: "Método de pagamento criado com sucesso!", type: "success" as const },
        };
      }
      case "updatePaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          updatePaymentMethodBodySchema,
        ).validate(body);
        await this.updateUseCase.execute(validated.id, validated.name, campaignId);
        return {
          toast: { message: "Método de pagamento atualizado com sucesso!", type: "success" as const },
        };
      }
      case "deletePaymentMethod": {
        const validated = new SchemaValidatorAdapter(
          deletePaymentMethodBodySchema,
        ).validate(body);
        await this.deleteUseCase.execute(validated.id, campaignId);
        return {
          toast: { message: "Método de pagamento excluído com sucesso!", type: "success" as const },
        };
      }
      default:
        throw HttpAdapter.badRequest("Ação inválida");
    }
  }
}

export { PaymentMethodController };
