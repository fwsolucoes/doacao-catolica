import {
  CircleCheck,
  CircleSlash,
  Phone,
  QrCode,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useState } from "react";
import type { ComponentProps } from "react";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import type { CampaignWhatsappLoader } from "~/client/types/campaignWhatsappLoader";
import { ActiveBadge, BulletItem, SelectedButton } from "./card-shared";
import { OwnNumberConfigDialog } from "./own-number-config-dialog";

// known values: "aini" | "unofficial_whaticket"
const CONNECTION_TYPE_BADGE: Record<
  string,
  {
    variant: ComponentProps<typeof Badge>["variant"];
    label: string;
    icon: typeof ShieldCheck;
  }
> = {
  aini: { variant: "navy", label: "Conexão Oficial Meta", icon: ShieldCheck },
  unofficial_whaticket: {
    variant: "violet",
    label: "Conexão QR code",
    icon: QrCode,
  },
};

function OwnNumberCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  const settings = useLoaderData<CampaignWhatsappLoader>();
  const isConfigured =
    settings?.type === "custom" && settings?.hasToken === true;
  const connectionBadge = settings?.provider
    ? CONNECTION_TYPE_BADGE[settings.provider]
    : undefined;
  const ConnectionIcon = connectionBadge?.icon;

  const [showConfig, setShowConfig] = useState(false);
  const handleSave = useCallback(() => {
    setShowConfig(false);
    onSelect();
  }, [onSelect]);

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
            <span className="text-base font-semibold tracking-tight text-foreground">
              Número Próprio
            </span>
            <p className="text-base text-muted-foreground">
              Conecte um número exclusivo da sua paróquia ou instituição, com a
              sua identidade nas mensagens.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-7 pb-7">
          <div className="flex flex-col gap-2.5">
            <BulletItem text="Identidade própria (nome e foto do seu número)" />
            <BulletItem text="Requer contratação de um plano dedicado" />
            <BulletItem text="Atendimento e configuração feitos pelo time comercial" />
          </div>

          <div className="mt-auto flex flex-col gap-3.5 pt-2.5">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                {isConfigured ? (
                  <div className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    <CircleCheck size={14} />
                    Configurado
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-xl bg-[#e6e6ed] px-3 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-card">
                    <CircleSlash size={14} />
                    Não configurado
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 text-xs"
                  onClick={() => setShowConfig(true)}
                >
                  <Settings2 size={15} />
                  Configurações
                </Button>
              </div>
              {isConfigured && settings?.provider && (
                <Badge
                  variant={connectionBadge?.variant ?? "neutral"}
                  className="w-fit"
                >
                  {ConnectionIcon && (
                    <ConnectionIcon size={11} data-icon="inline-start" />
                  )}
                  {connectionBadge?.label ?? settings.provider}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">
                Configure a conexão do seu número antes de selecionar esta
                opção.
              </p>
            </div>

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
        onSave={handleSave}
      />
    </>
  );
}

export { OwnNumberCard };
