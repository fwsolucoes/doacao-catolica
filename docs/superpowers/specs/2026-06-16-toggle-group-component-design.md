# Design: Componente ToggleGroup (ui/)

**Data:** 2026-06-16

## Contexto

O `createRecurrence` tem um `ToggleGroup` local implementado com `<button>` bruto, `hidden input` e `cn()` manual — fora dos padrões definidos em `src/client/components/ui/CLAUDE.md` (Radix como primitivo, `tv()` para variantes, composição via objeto exportado). O Radix `@radix-ui/react-toggle-group` já está disponível via `radix-ui` (sem instalação adicional). O Shadcn também tem um componente `toggle-group` no catálogo, mas o projeto prefere importar diretamente do Radix e estilizar manualmente seguindo suas convenções.

## Objetivo

Criar `src/client/components/ui/toggle-group.tsx` seguindo os padrões do projeto e substituir o `ToggleGroup` local de `createRecurrence`.

## API

Composição via objeto exportado, seguindo o padrão de `Card`, `Dialog`, etc.:

```tsx
export const ToggleGroup = { Root, Item };
```

### `Root`

- Envolve `ToggleGroup.Root` do Radix com `type="single"` fixo (seleção exclusiva)
- Aceita prop `name?: string` — quando fornecida, renderiza `<input type="hidden" name={name} value={value ?? ""}>` para compatibilidade com forms nativos
- Repassa `value` e `onValueChange` ao Radix Root
- Estilo base: `flex gap-2`

```tsx
<ToggleGroup.Root name="paymentType" value={paymentType} onValueChange={setPaymentType}>
  ...
</ToggleGroup.Root>
```

### `Item`

- Envolve `ToggleGroupItem` do Radix
- Estilizado via `tv()` usando o atributo `data-state` do Radix:
  - `data-state="on"` → `border-(--primary) bg-(--primary) text-white`
  - `data-state="off"` → `border-(--border) bg-(--card) text-(--foreground) hover:bg-(--accent)`
- Tamanho base: `h-9 rounded-md border px-4 text-sm font-medium transition-colors`

```tsx
<ToggleGroup.Item value="pix">Pix</ToggleGroup.Item>
<ToggleGroup.Item value="bank_slip">Boleto</ToggleGroup.Item>
```

## Arquivo alterado (além do novo componente)

### `src/client/pages/createRecurrence/index.tsx`

- Remove a função `ToggleGroup` local (e seu tipo)
- Importa `ToggleGroup` de `~/client/components/ui/toggle-group`
- Atualiza as duas usagens para a API de composição (`Root` + `Item`)

## Restrições

- `type="single"` é fixo no `Root` — não expor `type="multiple"` (não há caso de uso no projeto)
- `name` é opcional no `Root` — o componente deve funcionar sem form
- Não usar `Button` internamente no `Item` — o Radix `ToggleGroupItem` já gerencia foco, acessibilidade e `data-state`; acoplar ao `Button` adicionaria complexidade sem benefício
- Seguir CLAUDE.md de ui/: `tv()`, named exports, tokens do design system, sem `"use client"`
