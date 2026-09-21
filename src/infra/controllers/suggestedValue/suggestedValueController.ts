import type { ListSuggestedValuesUseCase } from "~/app/useCases/suggestedValue/listSuggestedValuesUseCase";
import type { CreateSuggestedValueUseCase } from "~/app/useCases/suggestedValue/createSuggestedValueUseCase";
import type { UpdateSuggestedValueUseCase } from "~/app/useCases/suggestedValue/updateSuggestedValueUseCase";
import type { DeleteSuggestedValueUseCase } from "~/app/useCases/suggestedValue/deleteSuggestedValueUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import {
  createSuggestedValueSchema,
  updateSuggestedValueSchema,
  deleteSuggestedValueSchema,
} from "~/infra/schemas/internal/suggestedValue";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class SuggestedValueController {
  constructor(
    private listUseCase: ListSuggestedValuesUseCase,
    private createUseCase: CreateSuggestedValueUseCase,
    private updateUseCase: UpdateSuggestedValueUseCase,
    private deleteUseCase: DeleteSuggestedValueUseCase,
  ) {}

  async handleLoader(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const values = await this.listUseCase.execute(campaignId, user.token);
    return { suggestedValues: values.map((v) => v.toJson()) };
  }

  async handleAction(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    switch (body._action) {
      case "createSuggestedValue": {
        const validated = new SchemaValidatorAdapter(createSuggestedValueSchema).validate(body);
        await this.createUseCase.execute(validated.description, validated.amount, campaignId, user.token);
        return { toast: { message: "Valor sugerido adicionado com sucesso!", type: "success" as const } };
      }
      case "updateSuggestedValue": {
        const validated = new SchemaValidatorAdapter(updateSuggestedValueSchema).validate(body);
        await this.updateUseCase.execute(validated.id, validated.description, validated.amount, user.token);
        return { toast: { message: "Valor sugerido atualizado com sucesso!", type: "success" as const } };
      }
      case "deleteSuggestedValue": {
        const validated = new SchemaValidatorAdapter(deleteSuggestedValueSchema).validate(body);
        await this.deleteUseCase.execute(validated.id, user.token);
        return { toast: { message: "Valor sugerido excluído com sucesso!", type: "success" as const } };
      }
      default:
        throw HttpAdapter.badRequest("Ação inválida");
    }
  }
}

export { SuggestedValueController };
