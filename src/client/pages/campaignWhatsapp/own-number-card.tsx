import { Headphones, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import { ActiveBadge, BulletItem, SelectedButton } from "./card-shared";
import { OwnNumberConfigDialog } from "./own-number-config-dialog";

function OwnNumberCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
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
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
            <Phone size={22} className="text-blue-600" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Número próprio
            </span>
            <p className="text-sm text-muted-foreground">
              Conecte um número exclusivo da sua paróquia ou instituição, com a
              sua identidade nas mensagens.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-7 pb-7">
          <div className="flex flex-col gap-2.5">
            <BulletItem text="Identidade própria (nome e foto do seu número)" />
            <BulletItem text="Requer contratação de um plano dedicado" />
            <BulletItem text="Atendimento e configuração feitos pelo time comercial" />
          </div>

          <div className="flex flex-col gap-3.5 pt-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Headphones size={15} />
              Falar com o time comercial
            </Button>
            {selected ? (
              <SelectedButton />
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => setShowConfig(true)}
              >
                Quero utilizar meu número
              </Button>
            )}
          </div>
        </div>
      </div>

      <OwnNumberConfigDialog
        open={showConfig}
        onOpenChange={setShowConfig}
        onSave={() => {
          setShowConfig(false);
          onSelect();
        }}
      />
    </>
  );
}

export { OwnNumberCard };
