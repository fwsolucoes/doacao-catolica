import type { SuggestedValue } from "../entities/suggestedValue";

type SuggestedValueGatewayDTO = {
  list(campaignId: string, token: string): Promise<SuggestedValue[]>;
  create(description: string, amount: number, campaignId: string, token: string): Promise<void>;
  update(id: string, description: string, amount: number, token: string): Promise<void>;
  delete(id: string, token: string): Promise<void>;
};

export type { SuggestedValueGatewayDTO };
