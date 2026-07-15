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

const RECURRING_PARAMS = [
  "registered_start",
  "registered_end",
  "payment_method",
  "status",
  "pay_day",
] as const;

const ONE_TIME_PARAMS = [
  "registered_start",
  "registered_end",
  "is_recurring",
] as const;

type RecurringDraft = {
  registeredStart: string;
  registeredEnd: string;
  paymentMethod: string;
  status: string;
  payDay: string;
};

type OneTimeDraft = {
  registeredStart: string;
  registeredEnd: string;
  isRecurring: string;
};

function recurringDraftFromParams(sp: URLSearchParams): RecurringDraft {
  return {
    registeredStart: sp.get("registered_start") ?? "",
    registeredEnd: sp.get("registered_end") ?? "",
    paymentMethod: sp.get("payment_method") ?? "",
    status: sp.get("status") ?? "",
    payDay: sp.get("pay_day") ?? "",
  };
}

function oneTimeDraftFromParams(sp: URLSearchParams): OneTimeDraft {
  return {
    registeredStart: sp.get("registered_start") ?? "",
    registeredEnd: sp.get("registered_end") ?? "",
    isRecurring: sp.get("is_recurring") ?? "",
  };
}

function DonorsFilterDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const sp = new URLSearchParams(location.search);
  const isOneTimeTab = sp.get("tab") === "pontuais";

  const [recurringDraft, setRecurringDraft] = useState<RecurringDraft>(
    recurringDraftFromParams(new URLSearchParams()),
  );
  const [oneTimeDraft, setOneTimeDraft] = useState<OneTimeDraft>(
    oneTimeDraftFromParams(new URLSearchParams()),
  );

  useEffect(() => {
    if (open) {
      const current = new URLSearchParams(location.search);
      setRecurringDraft(recurringDraftFromParams(current));
      setOneTimeDraft(oneTimeDraftFromParams(current));
    }
  }, [open]);

  const activeParams = isOneTimeTab ? ONE_TIME_PARAMS : RECURRING_PARAMS;
  const filterCount = activeParams.filter((p) => sp.get(p)).length;

  function applyFilters() {
    const nextSp = new URLSearchParams(location.search);

    if (isOneTimeTab) {
      const fields: [string, string][] = [
        ["registered_start", oneTimeDraft.registeredStart],
        ["registered_end", oneTimeDraft.registeredEnd],
        ["is_recurring", oneTimeDraft.isRecurring],
      ];
      for (const [key, value] of fields) {
        if (value) nextSp.set(key, value);
        else nextSp.delete(key);
      }
    } else {
      const fields: [string, string][] = [
        ["registered_start", recurringDraft.registeredStart],
        ["registered_end", recurringDraft.registeredEnd],
        ["payment_method", recurringDraft.paymentMethod],
        ["status", recurringDraft.status],
        ["pay_day", recurringDraft.payDay],
      ];
      for (const [key, value] of fields) {
        if (value) nextSp.set(key, value);
        else nextSp.delete(key);
      }
    }

    nextSp.delete("page");
    navigate(`?${nextSp.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const nextSp = new URLSearchParams(location.search);
    activeParams.forEach((p) => nextSp.delete(p));
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
              {isOneTimeTab
                ? "Refine a lista de doadores pontuais."
                : "Refine a lista de doadores recorrentes."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Data de cadastro</Label>
              <div className="flex gap-2.5">
                <Input
                  type="date"
                  value={
                    isOneTimeTab
                      ? oneTimeDraft.registeredStart
                      : recurringDraft.registeredStart
                  }
                  onChange={(e) =>
                    isOneTimeTab
                      ? setOneTimeDraft((d) => ({
                          ...d,
                          registeredStart: e.target.value,
                        }))
                      : setRecurringDraft((d) => ({
                          ...d,
                          registeredStart: e.target.value,
                        }))
                  }
                />
                <Input
                  type="date"
                  value={
                    isOneTimeTab
                      ? oneTimeDraft.registeredEnd
                      : recurringDraft.registeredEnd
                  }
                  onChange={(e) =>
                    isOneTimeTab
                      ? setOneTimeDraft((d) => ({
                          ...d,
                          registeredEnd: e.target.value,
                        }))
                      : setRecurringDraft((d) => ({
                          ...d,
                          registeredEnd: e.target.value,
                        }))
                  }
                />
              </div>
            </div>

            {isOneTimeTab ? (
              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold">É recorrente?</Label>
                <Select.Root
                  value={oneTimeDraft.isRecurring}
                  onValueChange={(v) =>
                    setOneTimeDraft((d) => ({ ...d, isRecurring: v }))
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Todos" />
                  </Select.Trigger>
                  <Select.Content position="popper">
                    <Select.Item value="">Todos</Select.Item>
                    <Select.Item value="true">Sim</Select.Item>
                    <Select.Item value="false">Não</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="font-semibold">Forma de pagamento</Label>
                  <Select.Root
                    value={recurringDraft.paymentMethod}
                    onValueChange={(v) =>
                      setRecurringDraft((d) => ({ ...d, paymentMethod: v }))
                    }
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
                    value={recurringDraft.status}
                    onValueChange={(v) =>
                      setRecurringDraft((d) => ({ ...d, status: v }))
                    }
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
                    value={recurringDraft.payDay}
                    onValueChange={(v) =>
                      setRecurringDraft((d) => ({ ...d, payDay: v }))
                    }
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
              </>
            )}

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
