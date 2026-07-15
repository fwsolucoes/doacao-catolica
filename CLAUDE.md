# donation-react-router-v7

## Stack
React Router v7 (SSR) · React 19 · Tailwind CSS v4 · tailwind-variants · shadcn/ui · Radix UI

## Estrutura de diretórios

```
src/
├── main/routes/        # rotas: _index.ts, route.*.tsx, layout.*.tsx, api.*.ts
├── client/
│   ├── components/ui/  # componentes genéricos reutilizáveis (ver CLAUDE.md local)
│   ├── components/     # componentes de aplicação não ligados a uma rota
│   ├── layouts/        # layouts visuais com <Outlet /> → <nome>Layout/index.tsx
│   ├── pages/          # componentes de página sem lógica de rota
│   └── hooks/          # hooks reutilizáveis
├── lib/                # utilitários — utils.ts, *.server.ts (só roda no servidor)
├── app/                # casos de uso e lógica de domínio
├── domain/             # entidades, gateways, protocolos
└── infra/              # adaptadores, controllers, DAL, serviços
```

## Convenção de nomes em `src/main/routes/`

| Tipo | Arquivo |
|------|---------|
| Index | `_index.ts` |
| Página | `route.<nome>.tsx` |
| Layout adapter | `layout.<nome>Layout.tsx` |
| API | `api.<nome>.ts` |

## Layouts (dois arquivos separados)

**`src/main/routes/layout.<nome>Layout.tsx`** — thin adapter, sem JSX:
```tsx
export async function loader(args: Route.LoaderArgs) { ... }
export function ErrorBoundary() { return <ErrorBoundaryPage />; }
export default <Nome>Layout;
```

**`src/client/layouts/<nome>Layout/index.tsx`** — estrutura visual com `<Outlet />`:
```tsx
export function <Nome>Layout() {
  return <><Header /><Outlet /></>;
}
```

## Tailwind: escala numérica vs. arbitrário

Tailwind v4 gera utilitários sob demanda (N × 4px). Preferir escala sobre `[Xpx]`:
- `max-w-240` (960px), `h-90` (360px), `w-15` (60px), `translate-x-4.5` (18px)
- Exceção: font sizes sem equivalente na escala → `text-[13px]` permitido

## Componentes UI

**Regra:** sempre usar os componentes do design system. Nunca usar elementos HTML nativos (`<button>`, `<input>`, `<select>`, etc.) quando existe um componente equivalente em `src/client/components/ui/`. Mesmo que o estilo exija customização, use o componente e sobrescreva via `className`:

```tsx
// correto — usa Button com override de estilo
<Button variant="ghost" className="text-destructive hover:opacity-75 hover:brightness-100">
  <XCircle size={16} /> Limpar
</Button>

// errado — usa <button> nativo para fugir do estilo padrão
<button className="text-destructive ...">
  <XCircle size={16} /> Limpar
</button>
```

Padrão de composição — sub-componentes via objeto exportado:
```tsx
export const Card = { Root, Title, Description };
// uso: <Card.Root><Card.Title>…</Card.Title></Card.Root>
```

Ver `src/client/components/ui/CLAUDE.md` para todas as regras de implementação.

### Badges resilientes a valores desconhecidos

Todo mapeamento de valor de API para badge **deve** ser resiliente: se a API retornar um valor não previsto, o badge exibe o valor bruto sem tradução e usa cor neutra — nunca quebra a tela.

Padrão obrigatório:
```tsx
// mapa tipado como Record<string, ...> para aceitar qualquer chave
const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  active: { className: "bg-emerald-100 text-emerald-700", label: "Ativo" },
  inactive: { className: "bg-red-100 text-red-700", label: "Inativo" },
};

// fallback explícito para chave ausente
const badge = STATUS_BADGE[value];
<span className={badge?.className ?? "bg-muted text-muted-foreground"}>
  {badge?.label ?? value}
</span>
```

No schema Zod, use `z.string()` em vez de `z.enum([...])` para campos exibidos em badge, evitando que a validação rejeite valores novos antes de chegar ao componente. Documente os valores conhecidos em comentário:
```ts
// known values: "active" | "inactive"
status: z.string(),
```

## Clean architecture — camadas

### DAL vs Gateway — quando usar cada um

Antes de criar um novo acesso a dados, escolha a camada correta:

| Critério | DAL (`infra/dal/`) | Gateway (`infra/gateways/`) |
|---|---|---|
| Propósito | Lista de seleção (combobox, dropdown) | Dados com filtros, paginação ou busca |
| SearchParams | Não | Sim (`app/search/<feature>SearchParams.ts`) |
| Tipo de retorno | View (`domain/views/`) | Option/Entity (`domain/gateways/`) |
| Parâmetros | Diretos (`accountId`, `token`) | Via `SearchParams` |
| Exemplos | `contact`, `activityArea`, `role` | `campaign`, `payments` |

**DAL** — endpoint retorna lista simples sem paginação, usada em selects/comboboxes:
```
ExternalSchema → DalInterface (domain/dal/) → Dal (infra/dal/) → UseCase → Controller → Factory
View class em domain/views/ — classe com restore() e toJson()
```

**Gateway** — endpoint tem filtros, paginação ou SearchParams:
```
ExternalSchema → GatewayInterface (domain/gateways/) → Gateway (infra/gateways/) → UseCase → Controller → Factory
SearchParams class em app/search/<feature>SearchParams.ts
```

Cada feature segue: `ExternalSchema → GatewayInterface → Gateway → UseCase → Controller → Factory → Route → Page`

### SearchParams

Query string para endpoints externos usa uma classe que estende `SearchParams` (`~/app/shared/searchParams`):

```ts
// src/app/search/<feature>SearchParams.ts
import { SearchParams } from "../shared/searchParams";
type Filter = { start_date: string; end_date: string };
class FeatureSearchParams extends SearchParams<Filter> {}
export { FeatureSearchParams };
```

No gateway: `url += searchParams.toExternal(["page", "pageLimit"])` — exclui paginação padrão quando o endpoint não a usa.

### Gateway interface (domain)

Parâmetros separados, não agrupados em objeto genérico:
```ts
// correto
getMetrics(id: string, searchParams: FeatureSearchParams): Promise<Data>
// evitar
getMetrics(params: { id: string; searchParams: FeatureSearchParams }): Promise<Data>
```

### donationApi vs api

- `api` (`~/infra/http/api`) — chamadas autenticadas com token do usuário
- `donationApi` (`~/infra/http/donationApi`) — endpoints da API de doações, autenticados via `api-key` no header (`environmentVariables.API_KEY_DONATION`). Controllers desses endpoints não precisam verificar `AuthService`.

## Formulários

Todo campo de formulário deve ser envolvido por `FormField`, inclusive campos com componentes customizados como `Combobox` e `ToggleGroup`. O `FormField` é o único ponto de exibição de erros retornados pelo servidor para aquele `name` — sem ele, um erro vindo da action não aparece na UI.

```tsx
// Padrão obrigatório — qualquer tipo de input
<FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
  <Form method="post">
    <FormField name="paymentType" label="Forma de pagamento:" required>
      <ToggleGroup name="paymentType" ... />
    </FormField>
    <FormField name="amount" label="Valor (R$):" required>
      <Input name="amount" ... />
    </FormField>
  </Form>
</FormErrorProvider>
```

Exceção: componentes que já encapsulam label + erro internamente (ex.: `SwitchField`) não precisam de wrapper externo.

Use `useFetcher` para obter `{ Form, state, data }` — o `data` alimenta o `FormErrorProvider`.

### Identificador de action no botão de submit

Nunca use `<input type="hidden" name="_action" value="..." />` para identificar qual action foi disparada. Em vez disso, coloque `name` e `value` diretamente no botão de submit — o par só é incluído no `FormData` quando aquele botão específico é clicado:

```tsx
// correto — action identificada pelo botão
<Button type="submit" name="_action" value="enableRecurrence">
  Ativar recorrência
</Button>

// errado — input hidden desnecessário
<input type="hidden" name="_action" value="enableRecurrence" />
<Button type="submit">Ativar recorrência</Button>
```

### Dialogs controlados por estado com `useFetcher`

Quando um componente pai controla a abertura de múltiplos dialogs via um único estado (`DialogState`) e passa `onClose` como prop, **nunca passe a callback como função inline**. O `useEffect` nos dialogs inclui `onClose` nas dependências — se a referência mudar a cada render, o efeito re-executa com dados obsoletos do `useFetcher` e fecha o dialog imediatamente ao abrir.

```tsx
// ERRADO — nova referência a cada render do pai
<EnableRecurrenceDialog onClose={() => setDialog(null)} />

// CORRETO — referência estável via useCallback
const closeDialog = useCallback(() => setDialog(null), []);
<EnableRecurrenceDialog onClose={closeDialog} />
```

**Por que isso quebra:** após um submit bem-sucedido, `fetcher.data` permanece com `{toast:{type:"success"}}`. Na próxima vez que o pai re-renderiza (ao abrir outro dialog), uma nova referência de `onClose` faz o `useEffect` disparar novamente — encontra `fetcher.state === "idle"` e `fetcher.data.toast.type === "success"` (dados da submissão anterior) e fecha o dialog imediatamente, sem o usuário perceber o flash.

## Utilitários de data

`src/lib/getMonthDates.ts` — retorna `{ firstDayOfMonth, lastDayOfMonth }` em `YYYY-MM-DD`:
- `getMonthDates(0)` → mês atual
- `getMonthDates(1)` → mês anterior
