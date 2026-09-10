import type { TotalPaymentsByAccountSearchParams } from "~/app/search/totalPaymentsByAccountSearchParams";
import type { TotalPaymentsByAccountJson } from "../entities/totalPaymentsByAccount";

type TotalPaymentsByAccountGatewayDTO = {
  getTotalPaymentsByAccount(
    searchParams: TotalPaymentsByAccountSearchParams,
  ): Promise<TotalPaymentsByAccountJson>;
};

export type { TotalPaymentsByAccountGatewayDTO };
