import { ListFilter, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { Select } from "~/client/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/client/components/ui/sheet";

const DRAWER_PARAMS = [
  "date_type",
  "origin",
  "type",
  "status",
  "notified_email",
  "notified_whatsapp",
] as const;

type DateType = "due" | "paid";

type FilterDraft = {
  dateType: DateType;
  startDate: string;
  endDate: string;
  origin: string;
  paymentType: string;
  status: string;
  notifiedEmail: string;
  notifiedWhatsapp: string;
};

function draftFromParams(sp: URLSearchParams): FilterDraft {
  return {
    dateType: sp.get("date_type") === "paid" ? "paid" : "due",
    startDate: sp.get("start_date") ?? "",
    endDate: sp.get("end_date") ?? "",
    origin: sp.get("origin") ?? "",
    paymentType: sp.get("type") ?? "",
    status: sp.get("status") ?? "",
    notifiedEmail: sp.get("notified_email") ?? "",
    notifiedWhatsapp: sp.get("notified_whatsapp") ?? "",
  };
}

function FilterDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(
    draftFromParams(new URLSearchParams()),
  );

  const sp = new URLSearchParams(location.search);
  const filterCount = DRAWER_PARAMS.filter((p) => sp.get(p)).length;

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setDraft(draftFromParams(new URLSearchParams(location.search)));
    setOpen(isOpen);
  }

  function clearFilters() {
    const nextSp = new URLSearchParams(location.search);
    DRAWER_PARAMS.forEach((p) => nextSp.delete(p));
    navigate(`?${nextSp.toString()}`);
  }

  function applyFilters() {
    const nextSp = new URLSearchParams(location.search);

    if (draft.dateType === "paid") nextSp.set("date_type", "paid");
    else nextSp.delete("date_type");

    const fields: [string, string][] = [
      ["origin", draft.origin],
      ["type", draft.paymentType],
      ["status", draft.status],
      ["notified_email", draft.notifiedEmail],
      ["notified_whatsapp", draft.notifiedWhatsapp],
    ];

    for (const [key, value] of fields) {
      if (value) nextSp.set(key, value);
      else nextSp.delete(key);
    }

    if (draft.startDate) {
      nextSp.set("start_date", draft.startDate);
      nextSp.set("end_date", draft.endDate);
      nextSp.set("period", "custom");
    }

    navigate(`?${nextSp.toString()}`);
    setOpen(false);
  }

  function clearAndClose() {
    clearFilters();
    setOpen(false);
  }

  function setField<K extends keyof FilterDraft>(field: K) {
    return (value: FilterDraft[K]) =>
      setDraft((d) => ({ ...d, [field]: value }));
  }

  return (
    <>
      {filterCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-destructive hover:brightness-100 hover:opacity-75 bg-card"
        >
          <XCircle size={16} />
          Limpar filtros
        </Button>
      )}

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative size-9 bg-card"
          >
            <ListFilter size={16} />
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
            <div className="border border-border rounded p-4">
              <div className="flex flex-col gap-2">
                <Label>Tipo de data:</Label>
                <RadioGroup.Root
                  value={draft.dateType}
                  onValueChange={(v) => setField("dateType")(v as DateType)}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item value="due" id="dateType-due" />
                    <label
                      htmlFor="dateType-due"
                      className="cursor-pointer text-sm"
                    >
                      Vencimento
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item value="paid" id="dateType-paid" />
                    <label
                      htmlFor="dateType-paid"
                      className="cursor-pointer text-sm"
                    >
                      Pagamento
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Data inicial:</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setField("startDate")(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Data final:</Label>
                <Input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => setField("endDate")(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de doador:</Label>
              <Select.Root
                value={draft.origin}
                onValueChange={setField("origin")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="subscription">Recorrente</Select.Item>
                  <Select.Item value="transfer">Pontual</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de pagamento:</Label>
              <Select.Root
                value={draft.paymentType}
                onValueChange={setField("paymentType")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="credit_card">
                    Cartão de crédito
                  </Select.Item>
                  <Select.Item value="pix">Pix</Select.Item>
                  <Select.Item value="bank_slip">Boleto</Select.Item>
                  <Select.Item value="manual_payment">Baixa manual</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status:</Label>
              <Select.Root
                value={draft.status}
                onValueChange={setField("status")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="received">
                    Disponível para saque
                  </Select.Item>
                  <Select.Item value="confirmed">
                    Pagamento confirmado
                  </Select.Item>
                  <Select.Item value="awaiting_payment">
                    Aguardando pagamento
                  </Select.Item>
                  <Select.Item value="overdue">Vencido</Select.Item>
                  <Select.Item value="canceled">Cancelado</Select.Item>
                  <Select.Item value="failed">Falha no pagamento</Select.Item>
                  <Select.Item value="refunded">Estornado</Select.Item>
                  <Select.Item value="deleted">Excluído</Select.Item>
                  <Select.Item value="manual">Recebido (manual)</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notificado por e-mail:</Label>
              <Select.Root
                value={draft.notifiedEmail}
                onValueChange={setField("notifiedEmail")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Qualquer</Select.Item>
                  <Select.Item value="1">Sim</Select.Item>
                  <Select.Item value="0">Não</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notificado por WhatsApp:</Label>
              <Select.Root
                value={draft.notifiedWhatsapp}
                onValueChange={setField("notifiedWhatsapp")}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Qualquer</Select.Item>
                  <Select.Item value="1">Sim</Select.Item>
                  <Select.Item value="0">Não</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <SheetFooter className="flex-row gap-3 px-4">
            <Button className="flex-1" onClick={applyFilters}>
              Aplicar
            </Button>
            <Button variant="ghost" className="flex-1" onClick={clearAndClose}>
              Limpar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { FilterDrawer };
