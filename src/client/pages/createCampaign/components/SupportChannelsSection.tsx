import { Mail, Phone } from "lucide-react";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";

function SupportChannelsSection() {
  return (
    <SectionCard
      title="Canais de suporte"
      description="Contatos exibidos na página pública da campanha para dúvidas dos doadores."
    >
      <div className="flex flex-col gap-1.5">
        <FormField name="supportWhatsapp" label="WhatsApp de suporte (botão flutuante)">
          <InputGroup.Root>
            <InputGroup.Addon>
              <Phone size={16} />
            </InputGroup.Addon>
            <InputGroup.Input name="supportWhatsapp" type="tel" placeholder="(11) 90000-0000" />
          </InputGroup.Root>
        </FormField>
        <p className="text-xs text-muted-foreground">
          Aparece como botão flutuante no canto inferior da página da campanha.
        </p>
      </div>
      <FormField name="supportEmail" label="E-mail de suporte">
        <InputGroup.Root>
          <InputGroup.Addon>
            <Mail size={16} />
          </InputGroup.Addon>
          <InputGroup.Input name="supportEmail" type="email" placeholder="suporte@paroquia.org.br" />
        </InputGroup.Root>
      </FormField>
    </SectionCard>
  );
}

export { SupportChannelsSection };
