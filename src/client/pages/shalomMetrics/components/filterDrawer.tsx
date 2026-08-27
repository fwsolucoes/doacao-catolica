import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/client/components/ui/sheet";
import { Button } from "~/client/components/ui/button";

type FilterDraft = {
  startDate: string;
  endDate: string;
};

function draftFromParams(sp: URLSearchParams): FilterDraft {
  return {
    startDate: sp.get("start_date") ?? "",
    endDate: sp.get("end_date") ?? "",
  };
}

type FilterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft, setDraft] = useState<FilterDraft>(draftFromParams(new URLSearchParams()));

  useEffect(() => {
    if (open) setDraft(draftFromParams(new URLSearchParams(location.search)));
  }, [open]);

  function applyFilters() {
    const sp = new URLSearchParams(location.search);
    if (draft.startDate) {
      sp.set("start_date", draft.startDate);
      sp.set("end_date", draft.endDate);
      sp.set("period", "custom");
    }
    navigate(`?${sp.toString()}`);
    onOpenChange(false);
  }

  function clearAndClose() {
    const sp = new URLSearchParams(location.search);
    sp.delete("start_date");
    sp.delete("end_date");
    sp.delete("period");
    navigate(`?${sp.toString()}`);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
          <div className="flex flex-col gap-2">
            <Label>Data inicial:</Label>
            <Input
              type="date"
              value={draft.startDate}
              onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data final:</Label>
            <Input
              type="date"
              value={draft.endDate}
              onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
            />
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
  );
}

export { FilterDrawer };
