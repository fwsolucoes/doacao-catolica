# RichTextarea no campo Mensagem WhatsApp — Régua de Mensagens

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `<Textarea>` simples do campo "Mensagem WhatsApp" nos modais de régua de mensagens pela `RichTextarea` existente, com suporte a negrito, itálico e sublinhado, inserção de variáveis no cursor e preview HTML.

**Architecture:** A `RichTextarea` é estendida com `forwardRef` + `useImperativeHandle` para expor `insertAtCursor(text)` e ganha uma prop opcional `onChange` que dispara com o HTML atual a cada alteração. O `WhatsAppTab` usa essa API para inserção de variáveis e rastreia o conteúdo HTML para o preview e o campo `enableWhatsapp`.

**Tech Stack:** React 19 (named imports), TypeScript, `contentEditable`, Selection API, Tailwind CSS v4.

## Global Constraints

- Named imports do React: `import { useRef, useState, forwardRef, useImperativeHandle } from "react"` — nunca `import * as React`
- Apenas `<Button>` do design system, nunca `<button>` nativo
- Identificadores em inglês; textos de UI podem ser em português
- Não incluir passos de commit — o usuário revisa na IDE e commita manualmente

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `src/client/components/campaignSettings/richTextarea.tsx` | Modificar — adicionar `forwardRef`, `useImperativeHandle`, prop `onChange` |
| `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx` | Modificar — substituir `Textarea` por `RichTextarea` |

---

### Task 1: Estender `RichTextarea` com API imperativa e callback `onChange`

**Files:**
- Modify: `src/client/components/campaignSettings/richTextarea.tsx`

**Interfaces:**
- Produz: tipo exportado `RichTextareaRef = { insertAtCursor(text: string): void }`, prop opcional `onChange?: (html: string) => void`
- Consome: nada de tasks anteriores

---

- [ ] **Step 1: Substituir o componente por uma versão com `forwardRef`**

Reescreva `src/client/components/campaignSettings/richTextarea.tsx` com o conteúdo abaixo:

```tsx
import { Bold, Italic, Underline } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ToggleGroup } from "~/client/components/ui/toggle-group";
import { cn } from "~/lib/utils";

type RichTextareaRef = {
  insertAtCursor: (text: string) => void;
};

type RichTextareaProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
};

const RichTextarea = forwardRef<RichTextareaRef, RichTextareaProps>(
  function RichTextarea({ name, placeholder, defaultValue, onChange }, ref) {
    const editorRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLInputElement>(null);
    const [activeFormats, setActiveFormats] = useState<string[]>([]);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultValue ?? "";
      }
    }, []);

    function syncHidden() {
      if (hiddenRef.current && editorRef.current) {
        hiddenRef.current.value = editorRef.current.innerHTML;
      }
    }

    function updateActiveFormats() {
      const formats: string[] = [];
      if (document.queryCommandState("bold")) formats.push("bold");
      if (document.queryCommandState("italic")) formats.push("italic");
      if (document.queryCommandState("underline")) formats.push("underline");
      setActiveFormats(formats);
    }

    function applyFormat(newFormats: string[]) {
      const toToggle = [
        ...newFormats.filter((f) => !activeFormats.includes(f)),
        ...activeFormats.filter((f) => !newFormats.includes(f)),
      ];
      editorRef.current?.focus();
      toToggle.forEach((cmd) => document.execCommand(cmd, false));
      syncHidden();
      updateActiveFormats();
    }

    useImperativeHandle(ref, () => ({
      insertAtCursor(text: string) {
        editorRef.current?.focus();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        syncHidden();
        onChange?.(editorRef.current?.innerHTML ?? "");
      },
    }));

    return (
      <div className="overflow-hidden rounded-[11px] border border-border bg-muted">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          <ToggleGroup.Root
            type="multiple"
            value={activeFormats}
            onValueChange={applyFormat}
            className="gap-0.5"
          >
            <ToggleGroup.Item value="bold" variant="icon" aria-label="Negrito">
              <Bold size={15} />
            </ToggleGroup.Item>
            <ToggleGroup.Item value="italic" variant="icon" aria-label="Itálico">
              <Italic size={15} />
            </ToggleGroup.Item>
            <ToggleGroup.Item value="underline" variant="icon" aria-label="Sublinhado">
              <Underline size={15} />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            syncHidden();
            onChange?.(editorRef.current?.innerHTML ?? "");
          }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onSelect={updateActiveFormats}
          className={cn(
            "min-h-28 p-3 text-sm outline-none",
            "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          )}
          data-placeholder={placeholder}
        />
        <input
          ref={hiddenRef}
          type="hidden"
          name={name}
          defaultValue={defaultValue}
        />
      </div>
    );
  },
);

export { RichTextarea, type RichTextareaRef };
```

- [ ] **Step 2: Verificar que os usos existentes continuam compilando**

Os arquivos abaixo usam `RichTextarea` sem ref nem `onChange` — nenhum deve precisar de alteração, mas confirme que o TypeScript não aponta erros:

- `src/client/pages/createCampaign/components/AboutUsSection.tsx`
- `src/client/pages/createCampaign/components/WhyDonateSection.tsx`
- `src/client/pages/campaignPage/aboutUsSection.tsx`
- `src/client/pages/campaignPage/whyDonateSection.tsx`
- `src/client/pages/campaignPage/pageContentSection.tsx`

Execute:
```bash
npx tsc --noEmit 2>&1 | grep richTextarea
```
Esperado: nenhuma saída (sem erros nesse arquivo).

---

### Task 2: Atualizar `WhatsAppTab` para usar `RichTextarea`

**Files:**
- Modify: `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`

**Interfaces:**
- Consome: `RichTextarea` e `RichTextareaRef` exportados na Task 1

---

- [ ] **Step 1: Reescrever `WhatsAppTab`**

Substitua o conteúdo de `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx`:

```tsx
import { useRef, useState } from "react";
import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import type { RichTextareaRef } from "~/client/components/campaignSettings/richTextarea";
import { FormField } from "~/client/components/ui/form-field";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { VariablePopover } from "../variable-popover";
import { WHATSAPP_DEFAULT } from "../../constants";

function WhatsAppTab({ defaultMessage }: { defaultMessage?: string }) {
  const initial = defaultMessage ?? WHATSAPP_DEFAULT;
  const [htmlContent, setHtmlContent] = useState(initial);
  const richRef = useRef<RichTextareaRef>(null);

  function insertVariable(variable: string) {
    richRef.current?.insertAtCursor(variable);
  }

  const hasContent = htmlContent.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <>
      <input
        type="hidden"
        name="enableWhatsapp"
        value={hasContent ? "true" : "false"}
      />
      <div className="grid grid-cols-5 gap-7">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">Inserir variável</p>
            <VariablePopover onInsert={insertVariable} />
          </div>
          <FormField name="whatsappMessage" label="Mensagem WhatsApp">
            <RichTextarea
              ref={richRef}
              name="whatsappMessage"
              defaultValue={initial}
              onChange={setHtmlContent}
            />
          </FormField>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">Prévia</p>
            <p className="text-xs text-muted-foreground">
              Variáveis serão preenchidas no envio
            </p>
          </div>
          <div className="overflow-clip rounded-2xl border border-border">
            <div className="flex items-center gap-2.5 bg-[#007a55] px-5 py-3">
              <WhatsAppIcon size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">Empresa Demo</span>
            </div>
            <div className="bg-[#ecfdf5] p-5">
              <p
                className="text-sm text-[#002c22]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { WhatsAppTab };
```

- [ ] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | grep whatsapp-tab
```
Esperado: nenhuma saída.

- [ ] **Step 3: Verificar o fluxo no browser**

Abra o modal de adicionar/editar régua de mensagens e vá até a aba WhatsApp. Verifique:

1. O campo exibe a toolbar (negrito, itálico, sublinhado) acima da área de texto
2. Selecionar texto e clicar em **Negrito** aplica `<b>` — o preview reflete o HTML formatado
3. Clicar em **Inserir variável** e escolher uma variável insere o texto na posição do cursor dentro do editor
4. Apagar todo o conteúdo — o `enableWhatsapp` oculto deve refletir `"false"` (inspecionar no DevTools → form data ou via Network ao submeter)
5. O formulário submete sem erros e o campo `whatsappMessage` carrega o HTML corretamente na reabertura do modal (edição)
