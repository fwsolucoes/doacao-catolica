# Empty State — My Campaigns

## Objetivo

Exibir um estado vazio visual quando a API não retornar nenhuma campanha na página `my-campaigns`, evitando uma tabela em branco.

## Abordagem

Empty state dentro do `Card.Root` (Opção A): o `TableCard` mantém o `<Card.Root>` como container, mas substitui o `<Table.Root>` + footer de paginação pelo `<Empty.Root>` quando `campaigns.data.length === 0`.

---

## 1. Novo componente: `Empty` (`src/client/components/ui/empty.tsx`)

Instalado via `bunx --bun shadcn@latest add empty` e adaptado às convenções do projeto:

- **`cva` → `tv()`**: substituir `cva` + `VariantProps` de `class-variance-authority` por `tv` + `VariantProps` de `tailwind-variants`
- **Exports compostos**: trocar os 6 exports planos pelo padrão de objeto composto do projeto:
  ```ts
  export const Empty = { Root, Header, Title, Description, Content, Media }
  ```
- **`"use client"`**: remover se presente (não usado neste projeto)
- **Tokens de cor**: `bg-muted`, `text-foreground`, `text-muted-foreground` já são semânticos — mantidos sem alteração

Sub-componentes resultantes:

| Export | Elemento base | Responsabilidade |
|--------|---------------|-----------------|
| `Empty.Root` | `div` | Container centralizado |
| `Empty.Header` | `div` | Agrupa mídia + título + descrição |
| `Empty.Media` | `div` | Ícone ou imagem (variante `"icon"` ou `"default"`) |
| `Empty.Title` | `div` | Título principal |
| `Empty.Description` | `div` | Texto descritivo opcional |
| `Empty.Content` | `div` | Área de ações (botões) |

---

## 2. Alteração: `TableCard` (`src/client/pages/myCampaigns/components/table/index.tsx`)

Adicionar verificação antes do `return` principal:

O `Empty.Root` tem `border-dashed` por padrão — dentro do `Card.Root` (que já tem borda própria) isso geraria borda dupla. Usar `className="border-none"` no `Empty.Root` para suprimir.

```tsx
if (campaigns.data.length === 0) {
  return (
    <Card.Root>
      <Empty.Root className="border-none">
        <Empty.Header>
          <Empty.Media variant="icon">
            <FolderOpen />
          </Empty.Media>
          <Empty.Title>Nenhuma campanha cadastrada</Empty.Title>
        </Empty.Header>
        <Empty.Content>
          <Button asChild>
            <Link to="#">Criar campanha</Link>
          </Button>
        </Empty.Content>
      </Empty.Root>
    </Card.Root>
  );
}
```

- Ícone: `FolderOpen` de `lucide-react`
- Botão: `<Button asChild><Link to="#">Criar campanha</Link></Button>` — rota `#` como placeholder até a rota de criação existir
- Footer de paginação: omitido automaticamente (não faz parte do branch de empty state)
- Comportamento existente (tabela com dados): inalterado

---

## Fora de escopo

- Criar rota de criação de campanha
- Skeleton/loading state
- Empty state em outras páginas
