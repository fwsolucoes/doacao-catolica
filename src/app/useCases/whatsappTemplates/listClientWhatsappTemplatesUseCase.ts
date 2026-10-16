import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplate } from "~/domain/views/whatsappTemplate";

type InputProps = {
  notificationType?: string;
  templateType?: string;
};

class ListClientWhatsappTemplatesUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(input: InputProps): Promise<WhatsappTemplate[]> {
    return this.whatsappTemplateDal.listClientWhatsappTemplates(
      input.notificationType,
      input.templateType,
    );
  }
}

export { ListClientWhatsappTemplatesUseCase };
