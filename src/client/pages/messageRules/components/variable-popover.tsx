import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Input } from "~/client/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/client/components/ui/popover";
import { TEMPLATE_VARIABLES } from "../constants";

type VariablePopoverProps = {
  onInsert: (variable: string) => void;
  disabled?: boolean;
};

function VariablePopover({ onInsert, disabled }: VariablePopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = TEMPLATE_VARIABLES.filter((v) =>
    v.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit" disabled={disabled}>
          <Plus size={14} />
          Inserir variável
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b border-border p-2">
          <Input
            leftIcon={Search}
            placeholder="Buscar variável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length > 0 ? (
            filtered.map((v) => (
              <Button
                key={v.value}
                variant="ghost"
                className="h-auto w-full justify-between px-3 py-2 font-normal"
                onClick={() => {
                  onInsert(v.value);
                  setOpen(false);
                }}
              >
                <span className="text-sm">{v.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {v.value}
                </span>
              </Button>
            ))
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Nenhuma variável encontrada.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { VariablePopover };
