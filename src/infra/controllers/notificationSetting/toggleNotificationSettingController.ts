import type { ToggleNotificationSettingUseCase } from "~/app/useCases/notificationSetting/toggleNotificationSettingUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { toggleNotificationSettingSchema } from "~/infra/schemas/internal/notificationSetting";
import type { RouteDTO } from "~/main/types/route";

class ToggleNotificationSettingController {
  constructor(
    private toggleNotificationSettingUseCase: ToggleNotificationSettingUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      toggleNotificationSettingSchema,
    ).validate(body);

    await this.toggleNotificationSettingUseCase.execute(
      campaignId,
      validated.uuid,
      validated.active,
    );

    return {
      toast: {
        message: validated.active
          ? "Configuração ativada com sucesso!"
          : "Configuração desativada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { ToggleNotificationSettingController };
