import { Pencil, Plus, X } from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import type { MetaTemplateEditLoader } from "~/client/types/metaTemplateEditLoader";
import { SectionCard } from "./SectionCard";

const SYSTEM_FIELDS: Record<string, string> = {
  "customers.name": "Nome do doador",
  "customers.email": "E-mail do doador",
  "customers.phone": "Telefone do doador",
  "payments.amount": "Valor do pagamento",
  "payments.due_date": "Vencimento do pagamento",
  "payments.gross_value": "Valor bruto do pagamento",
  "subscriptions.start_date": "Data de início da assinatura",
  "accounts.name": "Nome da organização",
};

function VariablesCard() {
  const { template } = useLoaderData<MetaTemplateEditLoader>();

  return (
    <SectionCard
      title="Variáveis"
      description="Na ordem em que aparecem no texto do template. Podem ser um valor fixo ou um dado do sistema."
    >
      <div className="flex flex-col gap-4">
        {template.variables.map((variable, index) => {
          const displayName =
            SYSTEM_FIELDS[variable.systemField] ?? variable.name ?? variable.systemField;
          return (
            <div
              key={variable.uuid}
              className="flex items-center justify-between rounded-2xl border border-border px-4 py-3.5"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-muted-foreground">{`{{${index + 1}}}`}</span>
                  <span className="text-sm font-semibold text-foreground">{displayName}</span>
                </div>
                {variable.description && (
                  <span className="text-xs text-muted-foreground">{variable.description}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  disabled
                >
                  <Pencil size={14} />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground"
                  disabled
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          );
        })}

        <Button type="button" variant="outline" className="w-fit gap-2" disabled>
          <Plus size={16} />
          Adicionar variável
        </Button>
      </div>
    </SectionCard>
  );
}

export { VariablesCard };
