import { ArrowLeft } from "lucide-react";
import * as React from "react";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Switch } from "~/client/components/ui/switch";
import type { ContactOption } from "~/domain/gateways/contacts";
import type { CreateRecurrenceLoader } from "~/client/types/createRecurrenceLoader";
import { cn } from "~/lib/utils";
import { useFilter } from "~/client/hooks/useFilter";

const CATEGORY_MAP: Record<number, "donation" | "tithe"> = {
  1: "donation",
  2: "tithe",
};

function ToggleGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={value} />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-9 rounded-md border px-4 text-sm font-medium transition-colors",
            value === opt.value
              ? "border-(--primary) bg-(--primary) text-white"
              : "border-(--border) bg-(--card) text-(--foreground) hover:bg-(--accent)",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SwitchField({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <Label className="cursor-pointer" onClick={() => onChange(!checked)}>
        {label}
      </Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ContactCard({ contact }: { contact: ContactOption }) {
  return (
    <div className="rounded-md border border-(--border) bg-(--secondary) p-4">
      <p className="font-medium text-(--foreground)">{contact.name}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-(--text-muted)">
        {contact.email && <span>{contact.email}</span>}
        {contact.phone && <span>{contact.phone}</span>}
        {contact.cpf && <span>CPF: {contact.cpf}</span>}
      </div>
    </div>
  );
}

function CreateRecurrencePage() {
  const { contacts, campaign } = useLoaderData<CreateRecurrenceLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedContactId, setSelectedContactId] = React.useState("");
  const [paymentType, setPaymentType] = React.useState<"pix" | "bank_slip">(
    "pix",
  );
  const [valueType, setValueType] = React.useState<"fixed" | "undetermined">(
    "fixed",
  );
  const [currentMonthPayment, setCurrentMonthPayment] = React.useState(false);
  const [activeNotification, setActiveNotification] = React.useState(true);
  const [showDiscount, setShowDiscount] = React.useState(false);
  const [showInterest, setShowInterest] = React.useState(false);
  const [showFine, setShowFine] = React.useState(false);
  const [fineType, setFineType] = React.useState<"fixed" | "percentage">(
    "fixed",
  );

  const selectedContact =
    contacts.find((c) => c.id === selectedContactId) ?? null;
  const category = CATEGORY_MAP[campaign.type] ?? "donation";

  const contactOptions = contacts.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const { handleChangeFilter } = useFilter("contacts");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/campaign/${campaignId}/payment-statements`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-(--border) hover:bg-(--accent)"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-semibold text-(--text-heading)">
          Adicionar recorrência
        </h1>
      </div>

      <Form method="post" className="space-y-6">
        <input type="hidden" name="accountId" value={campaign.accountId} />
        <input type="hidden" name="category" value={category} />

        {/* hidden contact fields — populated via combobox selection */}
        <input
          type="hidden"
          name="contactId"
          value={selectedContact?.id ?? ""}
        />
        <input
          type="hidden"
          name="contactName"
          value={selectedContact?.name ?? ""}
        />
        <input
          type="hidden"
          name="contactEmail"
          value={selectedContact?.email ?? ""}
        />
        <input
          type="hidden"
          name="contactPhone"
          value={selectedContact?.phone ?? ""}
        />
        <input
          type="hidden"
          name="contactCpf"
          value={selectedContact?.cpf ?? ""}
        />
        <input
          type="hidden"
          name="contactBirthDate"
          value={selectedContact?.birthDate ?? ""}
        />

        {/* contact selection */}
        <Card.Root className="p-6">
          <div className="mr-auto w-full max-w-xl flex flex-col gap-4">
            <h2 className="font-semibold text-(--text-heading)">Contato</h2>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactSearch">Pesquisar contato *</Label>
              <Combobox
                options={contactOptions}
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e)}
                placeholder="Selecione um contato"
                searchPlaceholder="Pesquisar por nome..."
                emptyText="Nenhum contato encontrado."
              />
            </div>
            {selectedContact && <ContactCard contact={selectedContact} />}
          </div>
        </Card.Root>

        {/* payment form */}
        <Card.Root className="p-6">
          <div className="mr-auto w-full max-w-xl flex flex-col gap-6">
            <h2 className="font-semibold text-(--text-heading)">Pagamento</h2>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paymentDay">Dia do vencimento *</Label>
              <Input
                id="paymentDay"
                name="paymentDay"
                type="number"
                min={1}
                max={31}
                placeholder="Ex: 10"
                className="max-w-36"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Forma de pagamento *</Label>
              <ToggleGroup
                name="paymentType"
                value={paymentType}
                onChange={(v) => setPaymentType(v as "pix" | "bank_slip")}
                options={[
                  { label: "Pix", value: "pix" },
                  { label: "Boleto", value: "bank_slip" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Tipo de valor *</Label>
              <ToggleGroup
                name="valueType"
                value={valueType}
                onChange={(v) => setValueType(v as "fixed" | "undetermined")}
                options={[
                  { label: "Valor fixo", value: "fixed" },
                  { label: "Valor indeterminado", value: "undetermined" },
                ]}
              />
            </div>

            {valueType === "fixed" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="5"
                  placeholder="0,00"
                  className="max-w-48"
                  required
                />
                <p className="text-xs text-(--text-muted)">
                  Valor mínimo: R$ 5,00
                </p>
              </div>
            )}

            <SwitchField
              name="currentMonthPayment"
              label="Gerar cobrança para o mês atual"
              checked={currentMonthPayment}
              onChange={setCurrentMonthPayment}
            />

            {/* optional fields: discount, interest, fine */}
            <div className="space-y-4 border-t border-(--border) pt-4">
              <p className="text-sm font-medium text-(--text-muted)">
                Condições financeiras (opcional)
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscount((v) => !v)}
                  className={cn(
                    "h-8 rounded-md border px-3 text-sm transition-colors",
                    showDiscount
                      ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                      : "border-(--border) bg-(--card) text-(--text-muted) hover:bg-(--accent)",
                  )}
                >
                  {showDiscount ? "− Desconto" : "+ Desconto"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInterest((v) => !v)}
                  className={cn(
                    "h-8 rounded-md border px-3 text-sm transition-colors",
                    showInterest
                      ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                      : "border-(--border) bg-(--card) text-(--text-muted) hover:bg-(--accent)",
                  )}
                >
                  {showInterest ? "− Juros" : "+ Juros"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFine((v) => !v)}
                  className={cn(
                    "h-8 rounded-md border px-3 text-sm transition-colors",
                    showFine
                      ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                      : "border-(--border) bg-(--card) text-(--text-muted) hover:bg-(--accent)",
                  )}
                >
                  {showFine ? "− Multa" : "+ Multa"}
                </button>
              </div>

              {showDiscount && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="discount">Desconto (R$)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className="max-w-48"
                  />
                </div>
              )}

              {showInterest && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="interest">Juros ao mês (%)</Label>
                  <Input
                    id="interest"
                    name="interest"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0,00"
                    className="max-w-48"
                  />
                </div>
              )}

              {showFine && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <Label>Tipo de multa</Label>
                    <ToggleGroup
                      name="fineType"
                      value={fineType}
                      onChange={(v) => setFineType(v as "fixed" | "percentage")}
                      options={[
                        { label: "Valor fixo (R$)", value: "fixed" },
                        { label: "Percentual (%)", value: "percentage" },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fineValue">
                      {fineType === "fixed" ? "Multa (R$)" : "Multa (%)"}
                    </Label>
                    <Input
                      id="fineValue"
                      name="fineValue"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="max-w-48"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Descreva a recorrência..."
                className={cn(
                  "w-full rounded-md border border-(--border) bg-(--input) px-3 py-2 text-sm",
                  "text-(--foreground) placeholder:text-(--text-muted)",
                  "outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                )}
              />
            </div>

            <SwitchField
              name="activeNotification"
              label="Enviar notificações ao doador"
              checked={activeNotification}
              onChange={setActiveNotification}
            />
          </div>
        </Card.Root>

        <div className="ml-auto flex w-fit max-w-xl justify-end gap-3">
          <Link to={`/campaign/${campaignId}/payment-statements`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || !selectedContactId}>
            {isSubmitting ? "Salvando..." : "Salvar recorrência"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export { CreateRecurrencePage };
