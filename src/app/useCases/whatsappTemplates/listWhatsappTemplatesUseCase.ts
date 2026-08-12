import type { WhatsappTemplateDalDTO } from "~/domain/dal/whatsappTemplate";
import type { WhatsappTemplate } from "~/domain/views/whatsappTemplate";

type InputProps = {
  notificationType?: string;
};

class ListWhatsappTemplatesUseCase {
  constructor(private whatsappTemplateDal: WhatsappTemplateDalDTO) {}

  async execute(input: InputProps): Promise<WhatsappTemplate[]> {
    return this.whatsappTemplateDal.listWhatsappTemplates(input.notificationType);
  }
}

export { ListWhatsappTemplatesUseCase };
