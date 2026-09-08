import {
  CircleCheck,
  CircleX,
  Headphones,
  Loader2,
  QrCode,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Input } from "~/client/components/ui/input";
import { RadioGroup } from "~/client/components/ui/radio-group";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";

type ConnectionType = "official" | "qrcode";
type TestConnectionData = { connected: boolean };
type SaveSettingsData = { success: boolean };

function OwnNumberConfigDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}) {
  const layoutData = useRouteLoaderData<CampaignLayoutLoader>(
    "main/routes/layout.campaignLayout",
  );
  const accountReference = layoutData?.campaign.id;

  const [connectionType, setConnectionType] =
    useState<ConnectionType | null>(null);
  const [token, setToken] = useState("");

  const testFetcher = useFetcher<TestConnectionData>();
  const isTesting = testFetcher.state !== "idle";
  const isConnected = testFetcher.data?.connected === true;
  const hasTested = testFetcher.data !== undefined;

  const saveFetcher = useFetcher<SaveSettingsData>();
  const isSaving = saveFetcher.state !== "idle";

  useEffect(() => {
    if (saveFetcher.state === "idle" && saveFetcher.data?.success) {
      onSave();
    }
  }, [saveFetcher.state, saveFetcher.data, onSave]);

  function handleOpenChange(value: boolean) {
    if (!value) {
      setConnectionType(null);
      setToken("");
    }
    onOpenChange(value);
  }

  function handleTest() {
    testFetcher.submit(
      { token },
      { method: "POST", action: "/api/whatsapp/testConnection" },
    );
  }

  function handleSave() {
    if (!connectionType || !accountReference) return;
    const provider =
      connectionType === "official" ? "aini" : "unofficial_whaticket";
    saveFetcher.submit(
      { accountReference, provider, type: "custom" },
      { method: "PUT", action: "/api/whatsapp/accountSettings" },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configurar número próprio</DialogTitle>
          <DialogDescription>
            Escolha o tipo de conexão e informe o token da API do seu número.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">
              Tipo de conexão
            </span>
            <RadioGroup.Root
              value={connectionType ?? ""}
              onValueChange={(v) => setConnectionType(v as ConnectionType)}
              className="grid grid-cols-2 gap-2.5"
            >
              <label
                htmlFor="connection-official"
                className={cn(
                  "flex cursor-pointer gap-3.5 rounded-2xl border p-3.5 transition-colors",
                  connectionType === "official"
                    ? "border-sidebar-primary bg-sidebar-primary/3"
                    : "border-border",
                )}
              >
                <RadioGroup.Item
                  value="official"
                  id="connection-official"
                  className="mt-0.5 shrink-0"
                />
                <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                        connectionType === "official"
                          ? "bg-sidebar-primary/10"
                          : "bg-background",
                      )}
                    >
                      <ShieldCheck
                        size={18}
                        className={cn(
                          "transition-colors",
                          connectionType === "official"
                            ? "text-sidebar-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      Conexão Oficial Meta
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp Business API oficial via Meta.
                  </p>
                </div>
              </label>

              <label
                htmlFor="connection-qrcode"
                className={cn(
                  "flex cursor-pointer gap-3.5 rounded-2xl border p-3.5 transition-colors",
                  connectionType === "qrcode"
                    ? "border-sidebar-primary bg-sidebar-primary/3"
                    : "border-border",
                )}
              >
                <RadioGroup.Item
                  value="qrcode"
                  id="connection-qrcode"
                  className="mt-0.5 shrink-0"
                />
                <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                        connectionType === "qrcode"
                          ? "bg-sidebar-primary/10"
                          : "bg-background",
                      )}
                    >
                      <QrCode
                        size={18}
                        className={cn(
                          "transition-colors",
                          connectionType === "qrcode"
                            ? "text-sidebar-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      Conexão QR code
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Conecte via leitura de QR code do aparelho.
                  </p>
                </div>
              </label>
            </RadioGroup.Root>
          </div>

          {connectionType && (
            <div className="flex flex-col gap-3.5 rounded-2xl border border-border p-3.5">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">
                    Token de acesso
                  </span>
                  {isTesting ? (
                    <Badge className="gap-1.5 bg-[#fde9c8] text-[#a8631a]">
                      <Loader2
                        size={14}
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                      Testando conexão...
                    </Badge>
                  ) : isConnected ? (
                    <Badge className="gap-1.5 bg-[#d4f5e2] text-[#1f7a4d]">
                      <CircleCheck size={14} data-icon="inline-start" />
                      Conectado
                    </Badge>
                  ) : hasTested ? (
                    <Badge className="gap-1.5 bg-[#ffe4e6] text-[#c70036]">
                      <CircleX size={14} data-icon="inline-start" />
                      Falha na conexão
                    </Badge>
                  ) : (
                    <Badge className="gap-1.5 bg-[#e6e6ed] text-muted-foreground dark:bg-card">
                      <CircleX size={14} data-icon="inline-start" />
                      Não conectado
                    </Badge>
                  )}
                </div>
                <Input
                  placeholder="Cole aqui o token da API do seu número"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Teste a conexão antes de confirmar o uso do número próprio.
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Se você não tem acesso a esse token de acesso, entre em
                  contato com nosso suporte técnico. Para esse tipo de conexão,
                  é necessário contratar um plano dedicado com conexão própria
                  de WhatsApp.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit gap-2"
                disabled={!token || isTesting}
                onClick={handleTest}
              >
                {isTesting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Wifi size={15} />
                )}
                {isTesting ? "Testando..." : "Testar conexão"}
              </Button>
              {hasTested && !isConnected && !isTesting && (
                <p className="text-xs text-[#ec003f]">
                  Falha na conexão. Verifique o token informado e tente
                  novamente.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" className="gap-2">
            <Headphones size={15} />
            Fale com o Suporte
          </Button>
          <div className="flex gap-2.5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!connectionType || isSaving || isTesting || !isConnected}
            >
              {isSaving && <Loader2 size={15} className="animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar configuração"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { OwnNumberConfigDialog };
