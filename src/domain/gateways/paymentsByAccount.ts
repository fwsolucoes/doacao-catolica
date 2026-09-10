import type { SearchResult } from "~/app/shared/searchResult";
import type { PaymentsByAccountSearchParams } from "~/app/search/paymentsByAccountSearchParams";
import type { Payment } from "../entities/payment";

type PaymentsByAccountGatewayDTO = {
  listPaymentsByAccount(
    searchParams: PaymentsByAccountSearchParams,
  ): Promise<SearchResult<Payment>>;
};

export type { PaymentsByAccountGatewayDTO };
