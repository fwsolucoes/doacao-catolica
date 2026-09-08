import { Headphones, QrCode, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
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
import { RadioGroup } from "~/client/components/ui/radio-group";

type ConnectionType = "official" | "qrcode";

function OwnNumberConfigDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}) {
  const [connectionType, setConnectionType] =
    useState<ConnectionType | null>(null);

  function handleOpenChange(value: boolean) {
    if (!value) setConnectionType(null);
    onOpenChange(value);
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

        <div className="flex flex-col gap-2 px-6">
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
                  ? "border-sidebar-primary"
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
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background">
                    <ShieldCheck size={18} className="text-muted-foreground" />
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
                  ? "border-sidebar-primary"
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
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background">
                    <QrCode size={18} className="text-muted-foreground" />
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
            <Button type="button" onClick={onSave}>
              Salvar configuração
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { OwnNumberConfigDialog };
