# Design: RichTextarea no campo Mensagem WhatsApp — Régua de Mensagens

**Data:** 2026-08-11  
**Status:** Aprovado

## Contexto

O campo "Mensagem WhatsApp" nos modais de adicionar/editar régua de mensagens usa atualmente um `<Textarea>` simples. O objetivo é substituí-lo pela `RichTextarea` existente (`src/client/components/campaignSettings/richTextarea.tsx`), que oferece formatação de texto (negrito, itálico, sublinhado) e armazena o conteúdo como HTML.

## Arquivos Afetados

- `src/client/components/campaignSettings/richTextarea.tsx` — extensão da API do componente
- `src/client/pages/messageRules/components/new-billing-rule-dialog/whatsapp-tab.tsx` — substituição do Textarea

## Mudanças em `RichTextarea`

### Novas props e ref

```ts
type RichTextareaRef = {
  insertAtCursor: (text: string) => void;
};

type RichTextareaProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (html: string) => void; // novo
};
```

### `forwardRef` + `useImperativeHandle`

O componente passa a usar `forwardRef<RichTextareaRef, RichTextareaProps>`. Via `useImperativeHandle`, expõe:

```ts
insertAtCursor(text: string): void
```

Implementação usa a Selection API:
1. Foca o `editorRef.current`
2. Obtém `window.getSelection()` e o range atual
3. Deleta o range e insere um nó de texto com `text`
4. Move o cursor para o final do nó inserido
5. Chama `syncHidden()` para atualizar o input oculto
6. Chama `onChange?.(editorRef.current.innerHTML)` — necessário porque manipulação programática via Selection API não dispara `onInput`

### Callback `onChange`

Adicionado ao `onInput` do `contentEditable`:

```ts
onInput={() => {
  syncHidden();
  onChange?.(editorRef.current?.innerHTML ?? "");
}}
```

### Compatibilidade retroativa

Nenhuma prop existente é alterada. Os usos atuais (`AboutUsSection`, `WhyDonateSection`, `pageContentSection`, etc.) continuam funcionando sem modificação.

## Mudanças em `WhatsAppTab`

### Estado

- Remove `message: string` e `cursorRef`
- Adiciona `htmlContent: string` controlado pelo `onChange` da `RichTextarea` (inicializado com `initial`)

### Inserção de variável

```ts
const richRef = useRef<RichTextareaRef>(null);

function insertVariable(variable: string) {
  richRef.current?.insertAtCursor(variable);
}
```

### Campo de mensagem

```tsx
<FormField name="whatsappMessage" label="Mensagem WhatsApp">
  <RichTextarea
    ref={richRef}
    name="whatsappMessage"
    defaultValue={initial}
    onChange={setHtmlContent}
  />
</FormField>
```

### `enableWhatsapp` hidden input

Strip de tags HTML para verificar se há conteúdo real:

```tsx
const hasContent = htmlContent.replace(/<[^>]*>/g, "").trim().length > 0;
<input type="hidden" name="enableWhatsapp" value={hasContent ? "true" : "false"} />
```

### Preview

```tsx
<p
  className="text-sm text-[#002c22]"
  dangerouslySetInnerHTML={{ __html: htmlContent }}
/>
```

Remove `whitespace-pre-wrap` (não necessário com HTML).

## Fluxo de dados

```
VariablePopover → insertVariable → richRef.insertAtCursor → contentEditable (DOM)
                                                          ↓
                                                    onInput → onChange → htmlContent
                                                                       ↓
                                                     enableWhatsapp hidden input
                                                     Preview (dangerouslySetInnerHTML)
                                                     RichTextarea hidden input (name="whatsappMessage")
```

## O que não muda

- Estrutura de grid (col-span-3 / col-span-2)
- `VariablePopover` — interface inalterada
- Layout do preview (header verde, background #ecfdf5)
- Validação e submit do formulário — o campo `whatsappMessage` continua enviando via hidden input da `RichTextarea`
