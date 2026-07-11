import type { PaymentMethod } from "../entities/paymentMethod";

type PaymentMethodGatewayDTO = {
  list(campaignId: string): Promise<PaymentMethod[]>;
  create(name: string, campaignId: string): Promise<void>;
  update(id: string, name: string, campaignId: string): Promise<void>;
  delete(id: string, campaignId: string): Promise<void>;
};

export type { PaymentMethodGatewayDTO };
