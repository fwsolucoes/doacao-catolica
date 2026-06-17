import { Pencil } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { getInitials } from "~/lib/getInitials";

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
};

function formatBirthDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function formatCpf(cpf: string | null): string {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
}

function ContactDetailCard({ contact }: ContactDetailCardProps) {
  const { name, cpf, birthDate, phone, email, avatar } = contact;
  const initials = getInitials(name);

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
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <Pencil size={14} />
          Editar
        </Button>
      </div>

      <div className="flex text-sm divide-x divide-border">
        <div className="pr-4">
          <p className="text-xs text-muted-foreground">Data de Nascimento</p>
          <p className="text-foreground">{formatBirthDate(birthDate)}</p>
        </div>
        <div className="px-4">
          <p className="text-xs text-muted-foreground">CPF/CNPJ</p>
          <p className="text-foreground">{cpf}</p>
        </div>
        <div className="pl-4">
          <p className="text-xs text-muted-foreground">Whatsapp</p>
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
          />
        </FormField>
      )}
      {!phone && (
        <FormField name="contactPhone" label="Whatsapp:">
          <Input name="contactPhone" type="tel" placeholder="+55" />
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
