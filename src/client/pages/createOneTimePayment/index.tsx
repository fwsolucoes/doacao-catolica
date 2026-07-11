import { ArrowLeft, Plus } from "lucide-react";
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
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Textarea } from "~/client/components/ui/textarea";
import type { CreateOneTimePaymentLoader } from "~/client/types/createOneTimePaymentLoader";
import { useFilter } from "~/client/hooks/useFilter";
import { ContactDetailCard } from "../createRecurrence/components/ContactDetailCard";

const CATEGORY_MAP: Record<number, "donation" | "tithe"> = {
  1: "donation",
  2: "tithe",
};

function CreateOneTimePaymentPage() {
  const { contacts, campaign, contactDetail, paymentMethods } =
    useLoaderData<CreateOneTimePaymentLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmitting = state === "submitting";

  const [selectedContactId, setSelectedContactId] = useState(
    contactDetail?.contactId ?? "",
  );
  const [paymentOption, setPaymentOption] = useState<
    "onlinePayment" | "receivedPayment"
  >("onlinePayment");
  const [paymentType, setPaymentType] = useState<"pix" | "bank_slip">("pix");
  const [offlineMethod, setOfflineMethod] = useState(
    paymentMethods[0]?.id ?? "",
  );

  useActionToast(data);

  useEffect(() => {
    if (data?.toast?.type !== "success") return;
    navigate(`/campaign/${campaignId}/donations`);
  }, [data?.toast?.type]);

  const category = CATEGORY_MAP[campaign.type] ?? "donation";
  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }));
  const { handleChangeFilter } = useFilter("contacts");

  const today = new Date().toISOString().split("T")[0];

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
          <Link to={`/campaign/${campaignId}/payment-statements`}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-(--text-heading)">
          Criar pagamento avulso
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

          {/* Card 1 — Contato */}
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
              {contactDetail && <ContactDetailCard contact={contactDetail} />}
            </div>
          </Card.Root>

          {/* Card 2 — Pagamento */}
          <Card.Root className="p-6">
            <div className="mr-auto w-full max-w-xl flex flex-col gap-6">
              <h2 className="font-semibold text-(--text-heading)">Pagamento</h2>

              <FormField
                name="paymentOption"
                label="Opção de pagamento:"
                required
              >
                <Select.Root
                  name="paymentOption"
                  value={paymentOption}
                  onValueChange={(v) =>
                    setPaymentOption(v as "onlinePayment" | "receivedPayment")
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="onlinePayment">
                      Gerar link de pagamento online
                    </Select.Item>
                    <Select.Item value="receivedPayment">
                      Registrar pagamento recebido (offline)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </FormField>

              {paymentOption === "onlinePayment" && (
                <>
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

                  <FormField name="amount" label="Valor:" required>
                    <CurrencyInput min={5} />
                    <p className="text-xs text-muted-foreground">
                      Valor mínimo: R$ 5,00
                    </p>
                  </FormField>

                  <FormField name="description" label="Descrição (opcional)">
                    <Textarea
                      name="description"
                      rows={3}
                      placeholder="Descreva o pagamento..."
                    />
                  </FormField>
                </>
              )}

              {paymentOption === "receivedPayment" && (
                <>
                  <FormField name="amount" label="Valor recebido:" required>
                    <CurrencyInput />
                  </FormField>

                  <FormField name="paymentDate" label="Data de pagamento:">
                    <Input
                      name="paymentDate"
                      type="date"
                      defaultValue={today}
                    />
                  </FormField>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <FormField
                        name="method"
                        label="Forma de pagamento:"
                        required
                      >
                        <Select.Root
                          name="method"
                          value={offlineMethod}
                          onValueChange={setOfflineMethod}
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {paymentMethods.map((pm) => (
                              <Select.Item key={pm.id} value={pm.id}>
                                {pm.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </FormField>
                    </div>
                    <Button variant="default" size="icon" asChild>
                      <Link
                        to={`/campaign/${campaignId}/settings/payment-methods`}
                      >
                        <Plus size={16} />
                      </Link>
                    </Button>
                  </div>

                  <FormField
                    name="bankAccount"
                    label="Conta de recebimento (opcional)"
                  >
                    <Input
                      name="bankAccount"
                      type="text"
                      placeholder="Ex: Conta corrente Banco X"
                    />
                  </FormField>

                  <FormField name="observations" label="Observações (opcional)">
                    <Textarea
                      name="observations"
                      rows={3}
                      placeholder="Observações sobre o pagamento..."
                    />
                  </FormField>
                </>
              )}
            </div>
          </Card.Root>

          <div className="ml-auto flex w-fit max-w-xl justify-end gap-3">
            <Link to={`/campaign/${campaignId}/payment-statements`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !contactDetail}>
              {isSubmitting ? "Salvando..." : "Salvar pagamento"}
            </Button>
          </div>
        </Form>
      </FormErrorProvider>
    </div>
  );
}

export { CreateOneTimePaymentPage };
