import { PaymentMethod } from "~/domain/entities/paymentMethod";
import type { ExternalPaymentMethod } from "../schemas/external/paymentMethod";

class PaymentMethodMapper {
  static toEntity(external: ExternalPaymentMethod): PaymentMethod {
    return PaymentMethod.restore({
      id: external.uuid,
      name: external.name,
    });
  }
}

export { PaymentMethodMapper };
