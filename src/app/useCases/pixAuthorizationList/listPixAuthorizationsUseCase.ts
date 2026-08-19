import { PixAuthorizationSearchParams } from "~/app/search/pixAuthorizationSearchParams";
import type { PixAuthorizationListGatewayDTO } from "~/domain/gateways/pixAuthorizationList";

type InputProps = {
  accountUuid: string;
  page?: number | null;
  status?: string;
  search?: string;
  order?: string;
};

class ListPixAuthorizationsUseCase {
  constructor(private gateway: PixAuthorizationListGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new PixAuthorizationSearchParams({
      page: input.page ?? 1,
      filter: {
        per_page: 20,
        status: input.status,
        search: input.search,
        order: input.order,
      },
    });

    const result = await this.gateway.listPixAuthorizations(
      input.accountUuid,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListPixAuthorizationsUseCase };
