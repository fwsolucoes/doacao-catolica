import { useState } from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import { AddSuggestedValueDialog } from "./components/addSuggestedValueDialog";
import { EditSuggestedValueDialog } from "./components/editSuggestedValueDialog";

type ToggleRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export type SuggestedValue = {
  id: string;
  amount: number;
  description: string;
};

function formatAmount(amount: number): string {
  return `R$ ${amount.toLocaleString("pt-BR")}`;
}

const DEFAULT_VALUES: SuggestedValue[] = [
  { id: "1", amount: 25, description: "Ajuda a manter as atividades diárias." },
  { id: "2", amount: 50, description: "Contribuição recorrente sugerida." },
  { id: "3", amount: 100, description: "Impacto significativo no projeto." },
];

const WALLET_OPTIONS = [
  { value: "principal", label: "Carteira Principal · R$ 12.480,00" },
];

function CampaignPaymentSettingsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);

  const [wallet, setWallet] = useState("principal");
  const [pixEnabled, setPixEnabled] = useState(true);
  const [boletoEnabled, setBoletoEnabled] = useState(true);
  const [creditCardEnabled, setCreditCardEnabled] = useState(true);
  const [minAmount, setMinAmount] = useState("10");
  const [passFeeToDonor, setPassFeeToDonor] = useState(false);
  const [suggestedValues] = useState<SuggestedValue[]>(DEFAULT_VALUES);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);
  const [chargeImmediately, setChargeImmediately] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SuggestedValue | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações desta campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex items-start gap-8">
        <StepNav steps={steps} />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Carteira digital */}
          <SectionCard
            title="Carteira digital"
            description="Selecione a carteira que receberá os valores das doações desta campanha."
          >
            <FormField name="walletId" label="Carteira para recebimento" required>
              <Combobox
                options={WALLET_OPTIONS}
                value={wallet}
                onChange={setWallet}
                placeholder="Selecione uma carteira"
              />
            </FormField>

            <div className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <Info size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Todos os pagamentos aprovados desta campanha serão creditados
                automaticamente na carteira digital selecionada. Você poderá
                transferir os valores para a conta bancária da instituição a
                qualquer momento na aba{" "}
                <strong className="font-semibold text-foreground">
                  Financeiro
                </strong>
                .
              </p>
            </div>
          </SectionCard>

          {/* Formas de pagamento */}
          <SectionCard
            title="Formas de pagamento"
            description="Habilite os métodos disponíveis para os doadores."
          >
            <ToggleRow
              title="Pix"
              description="Aprovação instantânea, sem taxas de intermediação."
              checked={pixEnabled}
              onChange={setPixEnabled}
            />
            <ToggleRow
              title="Boleto bancário"
              description="Compensação em até 3 dias úteis."
              checked={boletoEnabled}
              onChange={setBoletoEnabled}
            />
            <ToggleRow
              title="Cartão de crédito"
              description="Doações únicas e recorrentes em até 12x."
              checked={creditCardEnabled}
              onChange={setCreditCardEnabled}
            />
          </SectionCard>

          {/* Regras de doação */}
          <SectionCard
            title="Regras de doação"
            description="Limites e ajustes financeiros da campanha."
          >
            <FormField name="minAmount" label="Valor mínimo permitido (R$)">
              <Input
                name="minAmount"
                type="number"
                min="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="0"
              />
            </FormField>
            <ToggleRow
              title="Repassar taxa ao doador"
              description="O doador poderá optar por cobrir as taxas de processamento no checkout."
              checked={passFeeToDonor}
              onChange={setPassFeeToDonor}
            />
          </SectionCard>

          {/* Valores sugeridos */}
          <Card.Root className="flex flex-col gap-0 p-0">
            <div className="flex items-start justify-between gap-4 p-7">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Valores sugeridos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cards exibidos no checkout para agilizar a doação.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus size={15} />
                Adicionar
              </Button>
            </div>

            <div className="flex flex-col gap-5 px-7 pb-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {suggestedValues.map((val) => (
                  <div
                    key={val.id}
                    className="group relative rounded-xl border border-border bg-card p-5"
                  >
                    <p className="text-xl font-semibold tracking-tight text-foreground">
                      {formatAmount(val.amount)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {val.description}
                    </p>
                    <div className="mt-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-2.5 text-xs"
                        onClick={() => setEditTarget(val)}
                      >
                        <Pencil size={13} />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  className="flex h-auto min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-muted-foreground"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus size={16} />
                  <span className="text-sm">Novo valor</span>
                </Button>
              </div>

              <ToggleRow
                title='Habilitar opção "Outro valor"'
                description="Permite ao doador digitar um valor personalizado além dos sugeridos."
                checked={allowCustomAmount}
                onChange={setAllowCustomAmount}
              />
              <ToggleRow
                title="Gerar primeiro pagamento imediatamente no cadastro recorrente"
                description="Ao concluir o cadastro, a primeira cobrança recorrente é gerada na hora, sem esperar o próximo ciclo."
                checked={chargeImmediately}
                onChange={setChargeImmediately}
              />
            </div>
          </Card.Root>

          <div className="flex justify-end">
            <Button type="button" disabled>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>

      <AddSuggestedValueDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
      <EditSuggestedValueDialog
        target={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
}

export { CampaignPaymentSettingsPage };
