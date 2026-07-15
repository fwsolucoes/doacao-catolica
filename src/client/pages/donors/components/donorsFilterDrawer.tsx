import { SlidersHorizontal, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/client/components/ui/sheet";

const DRAWER_PARAMS = [
  "registered_start",
  "registered_end",
  "payment_method",
  "status",
  "pay_day",
] as const;

type FilterDraft = {
  registeredStart: string;
  registeredEnd: string;
  paymentMethod: string;
  status: string;
  payDay: string;
};

function draftFromParams(sp: URLSearchParams): FilterDraft {
  return {
    registeredStart: sp.get("registered_start") ?? "",
    registeredEnd: sp.get("registered_end") ?? "",
    paymentMethod: sp.get("payment_method") ?? "",
    status: sp.get("status") ?? "",
    payDay: sp.get("pay_day") ?? "",
  };
}

function DonorsFilterDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(
    draftFromParams(new URLSearchParams()),
  );

  useEffect(() => {
    if (open) setDraft(draftFromParams(new URLSearchParams(location.search)));
  }, [open]);

  const sp = new URLSearchParams(location.search);
  const filterCount = DRAWER_PARAMS.filter((p) => sp.get(p)).length;

  function setField<K extends keyof FilterDraft>(field: K) {
    return (value: FilterDraft[K]) =>
      setDraft((d) => ({ ...d, [field]: value }));
  }

  function applyFilters() {
    const nextSp = new URLSearchParams(location.search);
    const fields: [string, string][] = [
      ["registered_start", draft.registeredStart],
      ["registered_end", draft.registeredEnd],
      ["payment_method", draft.paymentMethod],
      ["status", draft.status],
      ["pay_day", draft.payDay],
    ];
    for (const [key, value] of fields) {
      if (value) nextSp.set(key, value);
      else nextSp.delete(key);
    }
    nextSp.delete("page");
    navigate(`?${nextSp.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const nextSp = new URLSearchParams(location.search);
    DRAWER_PARAMS.forEach((p) => nextSp.delete(p));
    nextSp.delete("page");
    navigate(`?${nextSp.toString()}`);
    setOpen(false);
  }

  return (
    <>
      {filterCount > 0 && (
        <Button
          type="button"
          variant="outline"
          className="gap-1.5 bg-card text-destructive hover:brightness-100 hover:opacity-75"
          onClick={clearFilters}
        >
          <XCircle size={16} />
          Limpar filtros
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="relative h-11 min-h-0 shrink-0 gap-2 px-4 text-sm"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {filterCount > 0 && (
              <span className="absolute -left-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Refine a lista de doadores recorrentes.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Data de cadastro</Label>
              <div className="flex gap-2.5">
                <Input
                  type="date"
                  value={draft.registeredStart}
                  onChange={(e) => setField("registeredStart")(e.target.value)}
                />
                <Input
                  type="date"
                  value={draft.registeredEnd}
                  onChange={(e) => setField("registeredEnd")(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Forma de pagamento</Label>
              <Select.Root
                value={draft.paymentMethod}
                onValueChange={setField("paymentMethod")}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Todas" />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todas</Select.Item>
                  <Select.Item value="pix">Pix</Select.Item>
                  <Select.Item value="automatic_pix">
                    Pix Automático
                  </Select.Item>
                  <Select.Item value="bank_slip">Boleto</Select.Item>
                  <Select.Item value="credit_card">
                    Cartão de Crédito
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Status</Label>
              <Select.Root
                value={draft.status}
                onValueChange={setField("status")}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Todos" />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="1">Ativo</Select.Item>
                  <Select.Item value="0">Inativo</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Dia da doação</Label>
              <Select.Root
                value={draft.payDay}
                onValueChange={setField("payDay")}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Todos" />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1)).map(
                    (day) => (
                      <Select.Item key={day} value={day}>
                        Dia {day}
                      </Select.Item>
                    ),
                  )}
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="danger" onClick={clearFilters}>
                Limpar
              </Button>
              <Button onClick={applyFilters}>Aplicar filtros</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { DonorsFilterDrawer };
