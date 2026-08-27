import { SearchParamsMapper } from "~/app/shared/searchParamsMapper";
import type { ListCampaignsUseCase } from "~/app/useCases/campaign/listCampaignsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { AuthService } from "~/infra/services/authService";
import { paginationSchema as listCampaignsSchema } from "~/infra/schemas/internal/pagination";
import type { RouteDTO } from "~/main/types/route";

class ListCampaignsController {
  constructor(private listCampaignsUseCase: ListCampaignsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const searchParams = SearchParamsMapper.toObject({
      query: route.query,
      params: route.params,
      scoped: "campaigns",
    });

    const schemaValidator = new SchemaValidatorAdapter(listCampaignsSchema);
    const validatedParams = schemaValidator.validate(searchParams);
    const mappedFilter = SearchParamsMapper.toFilter(validatedParams);

    return await this.listCampaignsUseCase.execute({
      page: mappedFilter.page,
      search: route.query.search || null,
      token: user.token,
    });
  }
}

export { ListCampaignsController };
