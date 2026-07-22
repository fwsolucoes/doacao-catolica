import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Textarea } from "~/client/components/ui/textarea";

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Imagem 1 -->
          <tr><td><img src="{{imagem_1}}" alt="Banner" style="width: 100%; height: auto; display: block;"></td></tr>
          <!-- Corpo -->
          <tr><td style="padding: 24px;">{{corpo_email}}</td></tr>
          <!-- Imagem 2 -->
          <tr><td><img src="{{imagem_2}}" alt="Rodapé" style="width: 100%; height: auto; display: block;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

function TipBanner() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <span className="text-xs font-semibold text-amber-800">Dica:</span>
      <span className="text-xs text-amber-700">
        Use tabelas para layout de email (não CSS Grid/Flexbox). Inclua as
        variáveis
      </span>
      <code className="font-mono text-xs text-amber-700">{"{{imagem_1}}"}</code>
      <span className="text-xs text-amber-700">,</span>
      <code className="font-mono text-xs text-amber-700">{"{{imagem_2}}"}</code>
      <span className="text-xs text-amber-700">e</span>
      <code className="font-mono text-xs text-amber-700">
        {"{{corpo_email}}"}
      </code>
      <span className="text-xs text-amber-700">no HTML.</span>
    </div>
  );
}

type NewLayoutDialogProps = {
  open: boolean;
  onClose: () => void;
};

function NewLayoutDialog({ open, onClose }: NewLayoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Novo layout</DialogTitle>
          <DialogDescription>
            Configure o HTML e as informações do layout.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 overflow-y-auto px-6">
          <FormField name="layoutName" label="Nome do layout" required>
            <Input name="layoutName" placeholder="Ex.: Layout básico" />
          </FormField>

          <FormField name="layoutDescription" label="Descrição">
            <Input
              name="layoutDescription"
              placeholder="Descreva o propósito deste layout"
            />
          </FormField>

          <FormField name="layoutHtml" label="HTML do layout" required>
            <Textarea
              name="layoutHtml"
              className="min-h-72 font-mono text-xs"
              defaultValue={DEFAULT_HTML}
            />
          </FormField>

          <TipBanner />
        </div>

        <DialogFooter showCloseButton closeButtonLabel="Cancelar">
          <Button type="button" onClick={onClose}>
            Salvar layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { NewLayoutDialog };
