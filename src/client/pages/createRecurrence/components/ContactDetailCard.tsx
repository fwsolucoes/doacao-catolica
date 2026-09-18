import { Pencil } from "lucide-react";
import { useLoaderData } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { PhoneInput } from "~/client/components/ui/phone-input";
import { useRoot } from "~/client/hooks/useRoot";
import { getInitials } from "~/lib/getInitials";
import type { CreateRecurrenceLoader } from "~/client/types/createRecurrenceLoader";

type ContactDetailCardProps = {
  contact: {
    contactId: string;
    name: string;
    cpf: string | null;
    birthDate: string | null;
    phone: string | null;
    email: string | null;
    avatar: string | null;
  };
  onPhoneChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
};

function ContactDetailCard({
  contact,
  onPhoneChange,
  onEmailChange,
}: ContactDetailCardProps) {
  const { name, cpf, birthDate, phone, email, avatar, contactId } = contact;
  const initials = getInitials(name);
  const { environmentVariables, user } = useRoot();
  const { currentUrl } = useLoaderData<CreateRecurrenceLoader>();

  const editHref = `${environmentVariables.SANCTON_CRM_PANEL_URL}/api/auth/token?token=${user?.token ?? ""}&redirect=/contact/${contactId}?redirectBack=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="rounded-lg border border-border  p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={avatar ?? undefined} alt={name} />
          <AvatarFallback className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="flex-1 font-semibold text-foreground">{name}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          asChild
        >
          <a href={editHref} target="_blank" rel="noopener noreferrer">
            <Pencil size={14} />
            Editar
          </a>
        </Button>
      </div>

      <div className="flex text-sm divide-x divide-border">
        <div className="pr-4">
          <p className="text-xs text-muted-foreground mb-1">
            Data de Nascimento
          </p>
          <p className="text-foreground">{birthDate}</p>
        </div>
        <div className="px-4">
          <p className="text-xs text-muted-foreground mb-1">CPF/CNPJ</p>
          <p className="text-foreground">{cpf}</p>
        </div>
        <div className="pl-4">
          <p className="text-xs text-muted-foreground mb-1">Whatsapp</p>
          <p className="text-foreground">{phone ?? "—"}</p>
        </div>
      </div>

      {email && <input type="hidden" name="contactEmail" value={email} />}
      {phone && <input type="hidden" name="contactPhone" value={phone} />}
      {birthDate && (
        <input type="hidden" name="contactBirthDate" value={birthDate} />
      )}

      {!email && (
        <FormField name="contactEmail" label="E-mail:">
          <Input
            name="contactEmail"
            type="email"
            placeholder="email@example.com"
            onChange={(e) => onEmailChange?.(e.target.value)}
          />
        </FormField>
      )}
      {!phone && (
        <FormField name="contactPhone" label="Whatsapp:">
          <PhoneInput
            defaultCountry="BR"
            onChange={(value) => {
              // react-phone-number-input returns "+55" (country code only) when cleared,
              // so only count as filled when there are digits beyond the country code
              const digits = (value ?? "").replace(/\D/g, "");
              onPhoneChange?.(digits.length > 2 ? (value ?? "") : "");
            }}
          />
        </FormField>
      )}
      {!birthDate && (
        <FormField name="contactBirthDate" label="Data de nascimento:">
          <Input name="contactBirthDate" type="date" />
        </FormField>
      )}
    </div>
  );
}

export { ContactDetailCard };
