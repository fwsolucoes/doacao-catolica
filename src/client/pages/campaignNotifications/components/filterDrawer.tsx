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

const FILTER_PARAMS = [
  "start_date",
  "end_date",
  "log_type",
  "channel",
] as const;

type Draft = {
  startDate: string;
  endDate: string;
  logType: string;
  channel: string;
};

function draftFromParams(sp: URLSearchParams): Draft {
  return {
    startDate: sp.get("start_date") ?? "",
    endDate: sp.get("end_date") ?? "",
    logType: sp.get("log_type") ?? "",
    channel: sp.get("channel") ?? "",
  };
}

function FilterDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(
    draftFromParams(new URLSearchParams()),
  );

  const sp = new URLSearchParams(location.search);
  const filterCount = FILTER_PARAMS.filter((p) => sp.get(p)).length;

  useEffect(() => {
    if (open) {
      setDraft(draftFromParams(new URLSearchParams(location.search)));
    }
  }, [open]);

  function applyFilters() {
    const next = new URLSearchParams(location.search);
    const fields: [string, string][] = [
      ["start_date", draft.startDate],
      ["end_date", draft.endDate],
      ["log_type", draft.logType],
      ["channel", draft.channel],
    ];
    for (const [key, value] of fields) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    navigate(`?${next.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const next = new URLSearchParams(location.search);
    FILTER_PARAMS.forEach((p) => next.delete(p));
    next.delete("page");
    navigate(`?${next.toString()}`);
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
              Refine a lista de notificações enviadas.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Data de envio</Label>
              <div className="flex gap-2.5">
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, startDate: e.target.value }))
                  }
                />
                <Input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Status</Label>
              <Select.Root
                value={draft.logType}
                onValueChange={(v) => setDraft((d) => ({ ...d, logType: v }))}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Todos" />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="success">Entregue</Select.Item>
                  <Select.Item value="awaiting_confirmation">
                    Enviado
                  </Select.Item>
                  <Select.Item value="error">Falha</Select.Item>
                  <Select.Item value="not_send">Não enviado</Select.Item>
                  <Select.Item value="blocked">Bloqueado</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold">Canal</Label>
              <Select.Root
                value={draft.channel}
                onValueChange={(v) => setDraft((d) => ({ ...d, channel: v }))}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Todos" />
                </Select.Trigger>
                <Select.Content position="popper">
                  <Select.Item value="">Todos</Select.Item>
                  <Select.Item value="whatsapp">WhatsApp</Select.Item>
                  <Select.Item value="sms">SMS</Select.Item>
                  <Select.Item value="email">E-mail</Select.Item>
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

export { FilterDrawer };
