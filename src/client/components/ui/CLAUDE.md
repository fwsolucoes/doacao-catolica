# Padrões de componentes UI

## Estrutura obrigatória

```tsx
import { tv, type VariantProps } from "tailwind-variants";
import type { ComponentProps } from "react";

const component = tv({ ... });

type ComponentVariants = VariantProps<typeof component>;
type ComponentProps = ComponentProps<"elemento"> & ComponentVariants;

export function Component({ className, variant, ...props }: ComponentProps) {
  return <elemento className={component({ variant, className })} {...props} />;
}
```

## Regras

**Exports:** sempre named exports. Nunca `export default`.

**Props nativas:** sempre extender `ComponentProps<"elemento">` do React para expor todos os atributos HTML nativos do elemento base.

**Variantes:** usar `tailwind-variants` (`tv`). Inferir os tipos com `VariantProps<typeof component>`.

**Merge de classes:** duas regras, dependendo do uso:

- **Com `tv()`**: passar `className` diretamente no call — `tv()` faz o merge internamente. Nunca usar `twMerge` por cima.
- **Sem `tv()`**: usar `cn()` de `~/lib/utils`. Nunca usar interpolação de string.

```tsx
// com tv() — correto
className={button({ variant, size, className })}

// com tv() — errado
className={twMerge(button({ variant, size }), className)}

// sem tv() — correto
className={cn("flex items-center gap-2", className)}

// sem tv() — errado
className={`flex items-center gap-2 ${className ?? ""}`}
```

**Tokens de cor:** usar sempre os tokens do design system definidos em `app.css`, nunca valores hex avulsos.

```tsx
// correto
"bg-accent-green text-black"

// errado
"bg-[#10B981] text-[#0A0A0A]"
```

**Fontes:** `font-mono` para JetBrains Mono (UI, código, elementos interativos), `font-sans` para fonte do sistema (texto corrido, descrições).

**Dark mode:** não hardcodar cores para modo escuro. Usar tokens semânticos (`bg-background`, `text-foreground`, `bg-card`…) que já respondem à classe `.dark` no `<html>`.

**`"use client"`:** nunca usar essa diretiva. O projeto usa React Router v7, não Next.js — hooks e interatividade funcionam normalmente em qualquer componente sem pragma.

**Slots no `tv()`:** para componentes com múltiplos elementos internos estilizados, usar a API `slots` do `tailwind-variants` em vez de múltiplos `tv()` separados.

```tsx
const badge = tv({
  slots: {
    root: "inline-flex items-center gap-2",
    dot: "size-2 rounded-full",
    label: "font-mono text-xs",
  },
  variants: {
    variant: {
      good: { dot: "bg-accent-green", label: "text-accent-green" },
    },
  },
});

// uso: desestruturar os slots e chamar cada um
const { root, dot, label } = badge({ variant });
<span className={root({ className })}>
  <span className={dot()} />
  <span className={label()}>{children}</span>
</span>
```

**Primitivos Radix UI:** para componentes com comportamento interativo que exigem acessibilidade (toggle, dialog, select, tooltip…), usar `@radix-ui/react-*` como primitivo e estilizar com Tailwind por cima. Não reinventar roda com `<div>` + handlers manuais.

**Escala Tailwind:** preferir valores da escala numérica do Tailwind (N × 4px) em vez de sintaxe arbitrária `[Xpx]`. Ex: `w-15` (60px), `h-90` (360px), `translate-x-4.5` (18px). Exceção: font sizes sem equivalente na escala (`text-[13px]`) ficam arbitrários.

**Largura de inputs:** todo componente de entrada de dados (`Input`, `Select.Trigger`, `Textarea` e similares) deve ter `w-full` como padrão. Restrições de largura são responsabilidade do layout que os envolve, não do componente.

**Estado de erro em inputs:** todo componente de entrada de dados deve reagir ao estado de erro do `FormField` pai via `group-data-[invalid]`:

```tsx
"group-data-[invalid]:border-(--destructive) group-data-[invalid]:focus-visible:ring-(--destructive)"
```

`FormField` expõe `data-invalid` no wrapper com a classe `group` quando há erro no campo. Usar sempre `group-data-invalid:` — não usar `aria-invalid:` para estilização via CSS.

Para acessibilidade, cada input deve também setar `aria-invalid` consumindo os contextos do `FormField`:

```tsx
import { use } from "react";
import { FormErrorContext, FormFieldContext } from "./form-field";

const name = use(FormFieldContext);
const fieldErrors = use(FormErrorContext);
const hasError = !!fieldErrors[name]?.length;

// setar antes do spread para permitir override explícito
<input aria-invalid={hasError || undefined} {...props} />
```

## Adicionando novos componentes (shadcn/ui)

Para adicionar um componente do catálogo shadcn/ui:

1. **Gerar:** `npx shadcn@latest add <nome>` — o arquivo entra em `src/client/components/ui/`
2. **Substituir CVA por `tv()`:** trocar `cva()` + `VariantProps` de `class-variance-authority` por `tv()` + `VariantProps` de `tailwind-variants`
3. **Trocar tokens:** substituir cores hardcoded (`bg-white`, `text-zinc-900`) pelos tokens do design system (`bg-background`, `text-foreground`)
4. **Corrigir exports:** remover `"use client"`, trocar `export default` por named export, agrupar sub-componentes em objeto composto (`export const Dialog = { Root, Title, Content }`)

Se o componente gerado não usa `cva()`, manter `cn()` de `~/lib/utils` para merge de classes.

**`asChild` no Button:** use `<Button asChild><Link to="...">Texto</Link></Button>` para renderizar o botão como elemento filho sem perder variantes.
