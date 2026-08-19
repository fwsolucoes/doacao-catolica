import type { PixAuthorizationHistoryJson } from "../entities/pixAuthorizationHistory";

type PixAuthorizationHistoryGatewayDTO = {
  getHistory(subscriptionUuid: string): Promise<PixAuthorizationHistoryJson>;
};

export type { PixAuthorizationHistoryGatewayDTO };
