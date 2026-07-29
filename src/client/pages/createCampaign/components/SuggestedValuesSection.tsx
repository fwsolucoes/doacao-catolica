import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { Button } from "~/client/components/ui/button";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import { Label } from "~/client/components/ui/label";
import { Textarea } from "~/client/components/ui/textarea";
import { DeleteSuggestedValueDialog } from "./DeleteSuggestedValueDialog";

export type SuggestedValue = {
  id: string;
  amount: string;
  description: string;
};

const INITIAL_VALUES: SuggestedValue[] = [
  {
    id: "1",
    amount: "25",
    description: "Ajuda a manter as atividades diárias.",
  },
  { id: "2", amount: "50", description: "Contribuição recorrente sugerida." },
  { id: "3", amount: "100", description: "Impacto significativo no projeto." },
];

let nextId = 4;

function SuggestedValuesSection() {
  const [values, setValues] = useState<SuggestedValue[]>(INITIAL_VALUES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SuggestedValue | null>(null);
  const [draft, setDraft] = useState<{ amount: string; description: string }>({
    amount: "",
    description: "",
  });

  function startEdit(val: SuggestedValue) {
    setEditingId(val.id);
    setDraft({ amount: val.amount, description: val.description });
  }

  function saveEdit() {
    if (!editingId) return;
    if (Number(draft.amount) < 5) {
      toast.warning("O valor mínimo permitido é R$ 5,00.");
      return;
    }
    setValues((prev) =>
      prev.map((v) =>
        v.id === editingId
          ? { ...v, amount: draft.amount, description: draft.description }
          : v,
      ),
    );
    setEditingId(null);
  }

  function cancelEdit(id: string) {
    // If it was a newly added card with empty amount, remove it
    const val = values.find((v) => v.id === id);
    if (val?.amount === "" && val?.description === "") {
      setValues((prev) => prev.filter((v) => v.id !== id));
    }
    setEditingId(null);
  }

  function addValue() {
    const newId = String(nextId++);
    const newVal: SuggestedValue = { id: newId, amount: "", description: "" };
    setValues((prev) => [...prev, newVal]);
    setEditingId(newId);
    setDraft({ amount: "", description: "" });
  }

  function removeValue(id: string) {
    setValues((prev) => prev.filter((v) => v.id !== id));
    if (editingId === id) setEditingId(null);
  }

  const serialized = JSON.stringify(
    values.map(({ amount, description }) => ({
      amount: Number(amount) || 0,
      description,
    })),
  );

  return (
    <SectionCard
      title="Valores sugeridos"
      description="Cards exibidos no checkout para agilizar a doação."
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addValue}
          className="shrink-0"
        >
          <Plus size={15} />
          Adicionar
        </Button>
      }
    >
      <input type="hidden" name="suggestedValues" value={serialized} />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {values.map((val) =>
          editingId === val.id ? (
            <div
              key={val.id}
              className="flex flex-col gap-3 rounded-xl border border-primary bg-primary/5 p-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label>Valor (R$)</Label>
                <CurrencyInput
                  defaultValue={Number(draft.amount) || undefined}
                  onValueChange={(v) =>
                    setDraft((d) => ({ ...d, amount: String(v) }))
                  }
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Descrição</Label>
                <Textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  placeholder="Ex.: Contribuição recorrente sugerida."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={saveEdit}
                  className="flex-1"
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => cancelEdit(val.id)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div
              key={val.id}
              className="group relative flex flex-col gap-1.5 rounded-xl border border-border p-4"
            >
              <span className="text-lg font-semibold tracking-tight text-foreground">
                R$ {Number(val.amount).toLocaleString("pt-BR")}
              </span>
              <span className="text-xs text-muted-foreground">
                {val.description}
              </span>
              <div className="mt-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(val)}
                  className="h-8 text-xs"
                >
                  <Pencil size={13} />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(val)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ),
        )}

        {editingId === null && (
          <Button
            type="button"
            variant="ghost"
            onClick={addValue}
            className="flex h-full min-h-32 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:bg-transparent hover:text-primary"
          >
            <Plus size={16} />
            Novo valor
          </Button>
        )}
      </div>

      <DeleteSuggestedValueDialog
        value={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => removeValue(deleteTarget!.id)}
      />
    </SectionCard>
  );
}

export { SuggestedValuesSection };
