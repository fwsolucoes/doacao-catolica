import { Mail } from "lucide-react";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

function SupportChannelsSection() {
  return (
    <SectionCard
      title="Canais de suporte"
      description="Contatos exibidos na página pública da campanha para dúvidas dos doadores."
    >
      <FormField
        name="supportWhatsapp"
        label="WhatsApp de suporte (botão flutuante)"
      >
        <InputGroup.Root>
          <InputGroup.Addon>
            <WhatsAppIcon size={16} />
          </InputGroup.Addon>
          <InputGroup.Input
            name="supportWhatsapp"
            type="tel"
            placeholder="(11) 90000-0000"
          />
        </InputGroup.Root>
        <p className="mt-1 text-xs text-muted-foreground">
          Aparece como botão flutuante no canto inferior da página da campanha.
        </p>
      </FormField>
      <FormField name="supportEmail" label="E-mail de suporte">
        <InputGroup.Root>
          <InputGroup.Addon>
            <Mail size={16} />
          </InputGroup.Addon>
          <InputGroup.Input
            name="supportEmail"
            type="email"
            placeholder="suporte@paroquia.org.br"
          />
        </InputGroup.Root>
      </FormField>
    </SectionCard>
  );
}

export { SupportChannelsSection };
