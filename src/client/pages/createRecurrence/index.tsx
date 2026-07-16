import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useFetcher,
} from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { Input } from "~/client/components/ui/input";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { Label } from "~/client/components/ui/label";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";
import { Alert } from "~/client/components/ui/alert";
import { SwitchField } from "~/client/components/ui/switch-field";
import type { CreateRecurrenceLoader } from "~/client/types/createRecurrenceLoader";
import { useFilter } from "~/client/hooks/useFilter";
import { ContactDetailCard } from "./components/ContactDetailCard";

const CATEGORY_MAP: Record<number, "donation" | "tithe"> = {
  1: "donation",
  2: "tithe",
};

function CreateRecurrencePage() {
  const { contacts, campaign, contactDetail } =
    useLoaderData<CreateRecurrenceLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmitting = state === "submitting";

  const [selectedContactId, setSelectedContactId] = useState(
    contactDetail?.contactId ?? "",
  );
  const [paymentType, setPaymentType] = useState<"pix" | "bank_slip">("pix");
  const [valueType, setValueType] = useState<"fixed" | "undetermined">("fixed");
  const [currentMonthPayment, setCurrentMonthPayment] = useState<"sim" | "não">(
    "sim",
  );
  const [activeNotification, setActiveNotification] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    setPhoneInput("");
    setEmailInput("");
  }, [contactDetail?.contactId]);

  useActionToast(data);

  useEffect(() => {
    if (data?.toast?.type !== "success") return;
    navigate(`/campaign/${campaignId}/donations`);
  }, [data?.toast?.type]);

  const effectivePhone = contactDetail?.phone ?? (phoneInput.trim() || null);
  const effectiveEmail = contactDetail?.email ?? (emailInput.trim() || null);

  const notificationAlert = (() => {
    if (!contactDetail) return null;
    if (!effectivePhone && !effectiveEmail) {
      return {
        disabled: true,
        message:
          "Não é possível ativar as notificações para esse contato, pois ele não possui e-mail e Whatsapp cadastrados.",
      };
    }
    if (!effectiveEmail) {
      return {
        disabled: false,
        message:
          "Esse contato receberá mensagens somente por Whatsapp pois não tem e-mail cadastrado.",
      };
    }
    if (!effectivePhone) {
      return {
        disabled: false,
        message:
          "Esse contato receberá mensagens somente por e-mail pois não tem Whatsapp cadastrado.",
      };
    }
    return null;
  })();

  const isNotificationDisabled = notificationAlert?.disabled ?? false;
  const effectiveNotification = isNotificationDisabled
    ? false
    : activeNotification;

  const category = CATEGORY_MAP[campaign.type] ?? "donation";

  const contactOptions = contacts.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const { handleChangeFilter } = useFilter("contacts");

  function handleContactChange(contactId: string) {
    setSelectedContactId(contactId);
    const params = new URLSearchParams(location.search);
    if (contactId) {
      params.set("contactPublicId", contactId);
    } else {
      params.delete("contactPublicId");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/campaign/${campaignId}/donations`}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-(--text-heading)">
          Adicionar recorrência
        </h1>
      </div>

      <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
        <Form method="post" className="space-y-6">
          <input type="hidden" name="accountId" value={campaign.accountId} />
          <input type="hidden" name="category" value={category} />
          <input
            type="hidden"
            name="contactId"
            value={contactDetail?.contactId ?? ""}
          />
          <input
            type="hidden"
            name="contactName"
            value={contactDetail?.name ?? ""}
          />

          {/* contact selection */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-4">
              <h2 className="font-semibold text-(--text-heading)">Contato</h2>
              <FormField name="contactId" label="Pesquisar contato:" required>
                <Combobox
                  options={contactOptions}
                  value={selectedContactId}
                  onChange={handleContactChange}
                  onSearchChange={(search) =>
                    handleChangeFilter("name", search)
                  }
                  placeholder="Selecione um contato"
                  searchPlaceholder="Pesquisar por nome..."
                  emptyText="Nenhum contato encontrado."
                />
              </FormField>
              {contactDetail && (
                <ContactDetailCard
                  contact={contactDetail}
                  onPhoneChange={setPhoneInput}
                  onEmailChange={setEmailInput}
                />
              )}
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
                />
              </FormField>

              <FormField
                name="paymentType"
                label="Forma de pagamento:"
                required
              >
                <Select.Root
                  name="paymentType"
                  value={paymentType}
                  onValueChange={(v) =>
                    setPaymentType(v as "pix" | "bank_slip")
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="pix">Pix</Select.Item>
                    <Select.Item value="bank_slip">Boleto</Select.Item>
                  </Select.Content>
                </Select.Root>
              </FormField>

              <FormField name="valueType" label="Tipo de valor:" required>
                <RadioGroup.Root
                  name="valueType"
                  value={valueType}
                  onValueChange={(v) =>
                    setValueType(v as "fixed" | "undetermined")
                  }
                >
                  <Label
                    htmlFor="valueType-fixed"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <RadioGroup.Item value="fixed" id="valueType-fixed" />
                    Valor fixo
                  </Label>
                  <Label
                    htmlFor="valueType-undetermined"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <RadioGroup.Item
                      value="undetermined"
                      id="valueType-undetermined"
                    />
                    Valor indeterminado
                  </Label>
                </RadioGroup.Root>
              </FormField>

              {valueType === "fixed" && (
                <FormField name="amount" label="Valor:" required>
                  <CurrencyInput min={5} />
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo: R$ 5,00
                  </p>
                </FormField>
              )}

              <FormField
                name="currentMonthPayment"
                label="Gerar cobrança para o mês atual:"
                required
              >
                <RadioGroup.Root
                  name="currentMonthPayment"
                  value={currentMonthPayment}
                  onValueChange={(v) =>
                    setCurrentMonthPayment(v as "sim" | "não")
                  }
                >
                  <Label
                    htmlFor="currentMonth-sim"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <RadioGroup.Item value="sim" id="currentMonth-sim" />
                    Sim
                  </Label>
                  <Label
                    htmlFor="currentMonth-não"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <RadioGroup.Item value="não" id="currentMonth-não" />
                    Não
                  </Label>
                </RadioGroup.Root>
              </FormField>

              <FormField name="description" label="Descrição (opcional)">
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Descreva a recorrência..."
                />
              </FormField>

              {notificationAlert && (
                <Alert.Root variant="warning">
                  <Alert.Icon>
                    <TriangleAlert size={16} />
                  </Alert.Icon>
                  <Alert.Title>Atenção!</Alert.Title>
                  <Alert.Description>
                    {notificationAlert.message}
                  </Alert.Description>
                </Alert.Root>
              )}

              <SwitchField
                name="activeNotification"
                label="Enviar notificações ao doador"
                checked={effectiveNotification}
                onChange={setActiveNotification}
                disabled={isNotificationDisabled}
              />
            </div>
          </Card.Root>

          <div className="ml-auto flex w-fit max-w-xl justify-end gap-3">
            <Link to={`/campaign/${campaignId}/donations`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !contactDetail}>
              {isSubmitting ? "Salvando..." : "Salvar recorrência"}
            </Button>
          </div>
        </Form>
      </FormErrorProvider>
    </div>
  );
}

export { CreateRecurrencePage };
