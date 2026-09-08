import { MessageCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import { ActiveBadge, BulletItem, SelectedButton } from "./card-shared";

function OfficialNumberCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col rounded-2xl border p-px transition-colors",
        selected
          ? "border-sidebar-primary bg-sidebar-primary/3"
          : "border-border bg-card",
      )}
    >
      {selected && <ActiveBadge />}

      <div className="flex items-start gap-3.5 px-7 pb-3.5 pt-10">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <MessageCircle size={22} className="text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Número oficial Doação Católica
            </span>
            <span className="rounded-xl bg-[#e6e6ed] px-3 py-0.5 text-xs font-semibold text-foreground dark:bg-card">
              Recomendado
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Use o número oficial da plataforma. Sem burocracia, sem precisar de
            chip ou aparelho próprio.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-7 pb-7">
        <div className="flex flex-col gap-2.5">
          <BulletItem text="Ativação imediata, sem configuração técnica" />
          <BulletItem text="Entrega garantida pelo WhatsApp Business API" />
          <BulletItem text="Cobrança por mensagem enviada (R$ 0,05 a R$ 0,40)" />
        </div>

        <div className="mt-auto flex flex-col gap-3.5 pt-2.5">
          <p className="text-xs text-muted-foreground">
            Você paga apenas pelas mensagens efetivamente enviadas.
          </p>
          {selected ? (
            <SelectedButton />
          ) : (
            <Button type="button" className="w-full" onClick={onSelect}>
              Usar número oficial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { OfficialNumberCard };
