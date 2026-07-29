import { useState } from "react";
import { Mail } from "lucide-react";
import type { Value } from "react-phone-number-input";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";
import { PhoneInput } from "~/client/components/ui/phone-input";

function SupportChannelsSection() {
  const [whatsapp, setWhatsapp] = useState<Value | "">("");

  return (
    <SectionCard
      title="Canais de suporte"
      description="Contatos exibidos na página pública da campanha para dúvidas dos doadores."
    >
      <div className="flex flex-col gap-1.5">
        <FormField name="supportWhatsapp" label="WhatsApp de suporte (botão flutuante)">
          <input type="hidden" name="supportWhatsapp" value={whatsapp} />
          <PhoneInput
            defaultCountry="BR"
            value={whatsapp}
            onChange={(v) => setWhatsapp(v || "")}
          />
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
