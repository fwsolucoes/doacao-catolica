import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { Link, useLoaderData, useParams, useFetcher } from "react-router";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Switch } from "~/client/components/ui/switch";
import { ToggleGroup } from "~/client/components/ui/toggle-group";
import type { Contact } from "~/domain/views/contact";
import type { CreateRecurrenceLoader } from "~/client/types/createRecurrenceLoader";
import { cn } from "~/lib/utils";
import { useFilter } from "~/client/hooks/useFilter";

const CATEGORY_MAP: Record<number, "donation" | "tithe"> = {
  1: "donation",
  2: "tithe",
};

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

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="rounded-md border border-(--border) bg-(--secondary) p-4">
      <p className="font-medium text-(--foreground)">{contact.name}</p>
    </div>
  );
}

function CreateRecurrencePage() {
  const { contacts, campaign } = useLoaderData<CreateRecurrenceLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";

  const [selectedContactId, setSelectedContactId] = React.useState("");
  const [paymentType, setPaymentType] = React.useState<"pix" | "bank_slip">(
    "pix",
  );
  const [valueType, setValueType] = React.useState<"fixed" | "undetermined">(
    "fixed",
  );
  const [currentMonthPayment, setCurrentMonthPayment] = React.useState<
    "sim" | "não"
  >("sim");
  const [activeNotification, setActiveNotification] = React.useState(true);
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

      <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
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

          {/* contact selection */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-4">
              <h2 className="font-semibold text-(--text-heading)">Contato</h2>
              <FormField name="contactId" label="Pesquisar contato:" required>
                <Combobox
                  options={contactOptions}
                  value={selectedContactId}
                  onChange={setSelectedContactId}
                  onSearchChange={(search) =>
                    handleChangeFilter("name", search)
                  }
                  placeholder="Selecione um contato"
                  searchPlaceholder="Pesquisar por nome..."
                  emptyText="Nenhum contato encontrado."
                />
              </FormField>
              {selectedContact && <ContactCard contact={selectedContact} />}
            </div>
          </Card.Root>

          {/* payment form */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-6">
              <h2 className="font-semibold text-(--text-heading)">Pagamento</h2>

              <FormField name="paymentDay" label="Dia do vencimento:" required>
                <Input
                  id="paymentDay"
                  name="paymentDay"
                  type="number"
                  min={1}
                  max={31}
                  placeholder="Ex: 10"
                  className="max-w-36"
                />
              </FormField>

              <FormField
                name="paymentType"
                label="Forma de pagamento:"
                required
              >
                <ToggleGroup.Root
                  name="paymentType"
                  value={paymentType}
                  onValueChange={(v) =>
                    setPaymentType(v as "pix" | "bank_slip")
                  }
                >
                  <ToggleGroup.Item value="pix">Pix</ToggleGroup.Item>
                  <ToggleGroup.Item value="bank_slip">Boleto</ToggleGroup.Item>
                </ToggleGroup.Root>
              </FormField>

              <FormField name="valueType" label="Tipo de valor:" required>
                <ToggleGroup.Root
                  name="valueType"
                  value={valueType}
                  onValueChange={(v) =>
                    setValueType(v as "fixed" | "undetermined")
                  }
                >
                  <ToggleGroup.Item value="fixed">Valor fixo</ToggleGroup.Item>
                  <ToggleGroup.Item value="undetermined">
                    Valor indeterminado
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </FormField>

              {valueType === "fixed" && (
                <FormField name="amount" label="Valor (R$):" required>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="5"
                    placeholder="0,00"
                    className="max-w-48"
                  />
                  <p className="text-xs text-(--text-muted)">
                    Valor mínimo: R$ 5,00
                  </p>
                </FormField>
              )}

              <FormField
                name="currentMonthPayment"
                label="Gerar cobrança para o mês atual:"
                required
              >
                <ToggleGroup.Root
                  name="currentMonthPayment"
                  value={currentMonthPayment}
                  onValueChange={(v) =>
                    setCurrentMonthPayment(v as "sim" | "não")
                  }
                >
                  <ToggleGroup.Item value="sim">Sim</ToggleGroup.Item>
                  <ToggleGroup.Item value="não">Não</ToggleGroup.Item>
                </ToggleGroup.Root>
              </FormField>

              <FormField name="description" label="Descrição (opcional)">
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
              </FormField>

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
      </FormErrorProvider>
    </div>
  );
}

export { CreateRecurrencePage };
