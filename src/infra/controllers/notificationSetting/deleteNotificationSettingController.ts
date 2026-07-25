import { z } from "zod";
import type { DeleteNotificationSettingUseCase } from "~/app/useCases/notificationSetting/deleteNotificationSettingUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import type { RouteDTO } from "~/main/types/route";

const deleteNotificationSettingSchema = z.object({ uuid: z.uuid() });

class DeleteNotificationSettingController {
  constructor(
    private deleteNotificationSettingUseCase: DeleteNotificationSettingUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      deleteNotificationSettingSchema,
    ).validate(body);

    await this.deleteNotificationSettingUseCase.execute(validated.uuid);

    return {
      toast: {
        message: "Configuração removida com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { DeleteNotificationSettingController };
