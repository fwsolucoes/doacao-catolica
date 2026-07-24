import type { CreateNotificationSettingUseCase } from "~/app/useCases/notificationSetting/createNotificationSettingUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createNotificationSettingSchema } from "~/infra/schemas/internal/notificationSetting";
import type { RouteDTO } from "~/main/types/route";

class CreateNotificationSettingController {
  constructor(
    private createNotificationSettingUseCase: CreateNotificationSettingUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      createNotificationSettingSchema,
    ).validate(body);

    await this.createNotificationSettingUseCase.execute(campaignId, {
      name: validated.name,
      type: validated.type,
      days: validated.days,
      whatsappMessage: validated.whatsappMessage,
      mailSubject: validated.mailSubject,
      mailMessage: validated.mailMessage,
      bannerImage: validated.emailImage1 || null,
      enableWhatsapp: validated.enableWhatsapp,
      enableMail: validated.enableMail,
      enablePix: validated.enablePix,
      enableCreditCard: validated.enableCreditCard,
      enableBankSlip: validated.enableBankSlip,
    });

    return {
      toast: {
        message: "Régua criada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateNotificationSettingController };
