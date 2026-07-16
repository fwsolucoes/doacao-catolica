import type { SearchResult } from "~/app/shared/searchResult";
import type { SubAccount } from "../entities/subAccount";

type SubAccountGatewayDTO = {
  listSubAccounts(
    accountId: number,
    token: string,
  ): Promise<SearchResult<SubAccount>>;
};

export type { SubAccountGatewayDTO };
