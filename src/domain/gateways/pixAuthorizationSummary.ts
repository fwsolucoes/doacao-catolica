import type { PixAuthorizationSummaryJson } from "../entities/pixAuthorizationSummary";

type PixAuthorizationSummaryGatewayDTO = {
  getSummary(accountUuid: string): Promise<PixAuthorizationSummaryJson>;
};

export type { PixAuthorizationSummaryGatewayDTO };
