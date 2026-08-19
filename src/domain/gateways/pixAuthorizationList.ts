import type { PixAuthorizationSearchParams } from "~/app/search/pixAuthorizationSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { PixAuthorization } from "../entities/pixAuthorization";

type PixAuthorizationListGatewayDTO = {
  listPixAuthorizations(
    accountUuid: string,
    searchParams: PixAuthorizationSearchParams,
  ): Promise<SearchResult<PixAuthorization>>;
};

export type { PixAuthorizationListGatewayDTO };
