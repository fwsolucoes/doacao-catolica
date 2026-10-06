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

**Regra:** sempre usar os componentes do design system. Nunca usar elementos HTML nativos (`<button>`, `<input>`, `<select>`, `<hr>`, etc.) quando existe um componente equivalente em `src/client/components/ui/`. Mesmo que o estilo exija customização, use o componente e sobrescreva via `className`:

Exemplos de mapeamento obrigatório:
- Divisor/linha separadora → `<Separator />` (nunca `<hr>`)
- Botão → `<Button>` (nunca `<button>`)
- Input → `<Input>` (nunca `<input>`)

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

Sempre usar o componente `<Badge>` de `~/client/components/ui/badge` — nunca `<span>` nativo. Espaçamento, tipografia e forma já estão no componente; passar apenas a cor via `className`.

Padrão obrigatório:
```tsx
import { Badge } from "~/client/components/ui/badge";

// mapa tipado como Record<string, ...> para aceitar qualquer chave
const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  active: { className: "bg-emerald-100 text-emerald-700", label: "Ativo" },
  inactive: { className: "bg-red-100 text-red-700", label: "Inativo" },
};

// fallback explícito para chave ausente
const badge = STATUS_BADGE[value];
<Badge className={badge?.className ?? "bg-muted text-muted-foreground"}>
  {badge?.label ?? value}
</Badge>
```

Quando o badge contém ícone, usar `data-icon` no ícone — o componente aplica `shrink-0` e `gap-1.5` automaticamente:
```tsx
<Badge className={badge?.className ?? "bg-muted text-muted-foreground"}>
  <RefreshCw size={11} data-icon="inline-start" />
  {badge?.label ?? value}
</Badge>
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

**Regra:** nunca concatenar parâmetros manualmente na URL do gateway (ex.: `url += "&per_page=20"`). Todos os parâmetros enviados ao endpoint devem vir do `SearchParams` via `toExternal()`. Se um parâmetro usa nomenclatura diferente da gerada por `toExternal` (ex.: endpoint espera `per_page` mas `toExternal` gera `pagesize`), exclua o gerado com `toExternal(["pageLimit"])` e inclua o correto como campo do `filter` no `SearchParams`. Se o endpoint já usa o valor padrão desejado, simplesmente exclua o parâmetro.

### Gateway interface (domain)

Parâmetros separados, não agrupados em objeto genérico:
```ts
// correto
getMetrics(id: string, searchParams: FeatureSearchParams): Promise<Data>
// evitar
getMetrics(params: { id: string; searchParams: FeatureSearchParams }): Promise<Data>
```

### Formatação de dados — responsabilidade do `toJson()`

O gateway é responsável apenas por buscar e mapear dados brutos da API para a entidade via `restore()`. Formatações de apresentação (datas, moedas, máscaras) pertencem ao `toJson()` da entidade — nunca ao gateway.

```ts
// correto — gateway repassa o valor bruto
SentNotification.restore({
  createdAt: item.created_at2, // "23/07/2026 10:00:00" — sem tocar
});

// toJson() da entidade faz a formatação
toJson() {
  const [createdAt, createdAtTime] = this.createdAt.split(" ");
  return { ..., createdAt: createdAt ?? "", createdAtTime: createdAtTime ?? "" };
}

// errado — gateway formata dado antes de passar à entidade
const [datePart, timePart] = item.created_at2.split(" ");
const [year, month, day] = datePart.split("-");
SentNotification.restore({ createdAt: `${day}/${month}/${year}`, createdAtTime: timePart });
```

### Schemas internos — conversões de tipo via `.transform()`

Schemas em `infra/schemas/internal/` validam dados brutos de formulário (strings). Conversões de tipo pertencem ao schema via `.transform()`, **nunca ao controller**. O controller recebe dados já tipados e corretos e os repassa diretamente ao use case.

```ts
// correto — conversões no schema
const updateSchema = z.object({
  status: z.string().transform((v) => v === "active"),           // string → boolean
  published: z.string().transform((v) => v === "true"),          // string → boolean
  totalGoal: z.string().optional().transform((v) => v ? parseFloat(v) : null), // string → number | null
  phone: z.string().optional().transform((v) => v || null),      // "" → null
});

// controller limpo — só valida e delega
const validated = new SchemaValidatorAdapter(updateSchema).validate(body);
return await useCase.execute({ id, token, ...validated });

// errado — conversões no controller
const validated = new SchemaValidatorAdapter(updateSchema).validate(body);
return await useCase.execute({
  id,
  token,
  status: validated.status === "active",     // ← não faz isso aqui
  totalGoal: parseFloat(validated.totalGoal), // ← não faz isso aqui
});
```

### donationApi vs api

- `api` (`~/infra/http/api`) — chamadas autenticadas com token do usuário
- `donationApi` (`~/infra/http/donationApi`) — endpoints da API de doações, autenticados via `api-key` no header (`environmentVariables.API_KEY_DONATION`). Controllers desses endpoints não precisam verificar `AuthService`.

## Tratamento de erros em actions e loaders

**Regra:** nunca retornar `ErrorHandlerAdapter.handle(error)` diretamente de um action ou loader. Sempre usar `ErrorHandlerAdapter.handleAsData(error)`.

Em React Router v7 SSR produção, retornar uma `Response` com status não-2xx (ex: 502) de um action/loader faz o roteador client-side tratar como erro de rota e acionar o `ErrorBoundary`, ignorando `fetcher.data`. Em desenvolvimento (Vite) o comportamento é mais permissivo e o body é parseado mesmo para respostas não-2xx, mascarando o bug.

`handleAsData` extrai o JSON da Response e o retorna como dado plain (status 200 implícito), o que popula `fetcher.data` corretamente e permite que `useActionToast` exiba o toast de erro.

```ts
// correto — retorna dados plain; fetcher.data é populado; toast funciona em prod
} catch (error) {
  return ErrorHandlerAdapter.handleAsData(error);
}

// errado — retorna Response 502; ErrorBoundary é acionado em prod
} catch (error) {
  return ErrorHandlerAdapter.handle(error);
}
```

`ErrorHandlerAdapter.handle` existe apenas para casos onde o caller faz `fetch()` nativo e precisa do HTTP status real — não é o caso de nenhuma rota atual.

## Formulários

### useState em campos de formulário — evitar

**Regra:** não usar `useState` para campos de formulário que só são lidos no submit (via `FormData`). Usar sempre não controlado: `defaultValue` (`Input`, `Textarea`, `Select.Root`) ou `defaultChecked` (`Switch`, `Checkbox`). Os componentes do design system em `src/client/components/ui/` são wrappers finos sobre Radix UI / elementos nativos — todos aceitam essas props sem necessidade de estado.

```tsx
// correto — não controlado, sem useState
<Input name="title" defaultValue={preferences.title ?? ""} />
<Select.Root name="status" defaultValue={preferences.status ?? "active"}>
  ...
</Select.Root>
<Switch name="enabled" defaultChecked={preferences.enabled ?? false} />

// errado — useState desnecessário, re-renderiza a página inteira a cada tecla
const [title, setTitle] = useState(preferences.title ?? "");
<Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
```

Para `Switch`, o Radix já gera sozinho um hidden input ("bubble input") que espelha o valor pro form nativo quando recebe `name` — não criar um `<input type="hidden">` manual ao lado.

**Atenção ao converter `Switch` controlado → `defaultChecked`:** o bubble input do Radix tem semântica de checkbox, não de booleano explícito — quando marcado, envia o literal do prop `value` (padrão `"on"`, **não** `"true"`); quando desmarcado, **o campo some do `FormData`** (não envia `"false"`). Isso é diferente do padrão antigo (hidden input manual que sempre mandava `"true"`/`"false"`). Dois ajustes obrigatórios ao migrar:

```tsx
// correto — value explícito + schema tolera ausência
<Switch name="enabled" value="true" defaultChecked={preferences.enabled ?? false} />
```
```ts
// schema: .optional() é obrigatório (campo pode não vir), ausência = false
enabled: z.string().optional().transform((v) => v === "true"),
```

Sem o `.optional()`, o Zod rejeita o submit inteiro quando o switch está desmarcado (campo ausente tratado como obrigatório faltando). Sem o `value="true"` explícito, marcado envia `"on"` e `v === "true"` sempre dá `false` — o toggle "liga" silenciosamente salva como desligado. Sempre conferir o schema Zod correspondente em `infra/schemas/internal/` antes de migrar um `Switch` existente.

**`useState` só se justifica quando o valor é usado em JS durante a digitação/seleção** — ex.: um campo deriva outro, há preview condicional na UI, ou o valor selecionado precisa alimentar um `<input type="hidden">` com um valor diferente do exibido (ver seção "FormField para selects controlados por estado" abaixo, caso do Pix). Fora isso, controlar o campo é desnecessário e re-renderiza o formulário inteiro a cada keystroke.

### Nomenclatura de campos de formulário

Todos os campos de formulário no frontend usam **camelCase**, nunca snake_case. Isso inclui campos visíveis, hidden inputs e os schemas internos em `infra/schemas/internal/`.

```tsx
// correto
<input type="hidden" name="pixKey" value={...} />
<input type="hidden" name="pixType" value={...} />
<Input name="scheduleDate" />

// errado
<input type="hidden" name="pix_key" value={...} />
<input type="hidden" name="pix_type" value={...} />
<Input name="schedule_date" />
```

A única exceção são os schemas externos (`infra/schemas/external/`) que refletem a nomenclatura da API externa.

Dados gerados pelo servidor (como datas calculadas com lógica de negócio) não devem ser enviados pelo frontend como hidden inputs — devem ser calculados no controller.

### Campos que vêm dos params de rota

Valores que existem nos params da URL não devem ser enviados como campos de formulário. O controller os extrai de `route.params` diretamente:

```ts
// correto — campaignId vem do param :campaignId na URL
const { campaignId } = route.params;
await useCase.execute({ accountUuid: campaignId, ... });

// errado — não enviar como campo hidden no formulário
<input type="hidden" name="accountUuid" value={campaignId} />
```

### FormField para selects controlados por estado

Quando um `<Select>` é controlado via estado React (`value` + `onValueChange`), não precisa de `name` prop — o valor é propagado pelos hidden inputs que dependem da seleção. O `FormField` deve ter o `name` do campo cujo erro deve exibir (ex.: `pixKey`), não o ID da conta selecionada:

```tsx
// correto — FormField mostra erro de pixKey se chave não for selecionada
<FormField name="pixKey" label="Selecione a chave Pix" required>
  <Select.Root value={selectedId} onValueChange={setSelectedId}>
    ...
  </Select.Root>
</FormField>
<input type="hidden" name="pixKey" value={selectedAccount?.pixKey ?? ""} />
```

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

### Feedback visual em botões de ação assíncrona fora de formulários

Botões que disparam uma ação assíncrona que **não** passa por `Form`/`useFetcher` (ex.: download de arquivo via `fetch` + blob, chamada a um endpoint que não é action/loader de rota) devem indicar carregamento e tratar erro — nunca ficar sem feedback enquanto o servidor processa.

**Regra:**
- Estado de carregamento via `useState` (aqui não é campo de formulário, então não se aplica a regra de evitar `useState` — ver seção "Formulários").
- Ícone trocado por `Loader2` com `animate-spin` enquanto carrega; texto do botão também muda.
- Botão `disabled` durante a execução, para evitar duplo clique.
- Erro tratado com `toast.error` (de `sonner`), nunca silenciosamente ignorado.

```tsx
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const [isExporting, setIsExporting] = useState(false);

async function handleExport() {
  if (isExporting) return;
  setIsExporting(true);
  try {
    const response = await fetch(exportHref);
    if (!response.ok) throw new Error("export failed");
    const blob = await response.blob();
    // cria <a> temporário com URL.createObjectURL(blob) e dispara o download
  } catch {
    toast.error("Não foi possível gerar o arquivo. Tente novamente.");
  } finally {
    setIsExporting(false);
  }
}

<Button type="button" variant="outline" onClick={handleExport} disabled={isExporting}>
  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
  {isExporting ? "Exportando..." : "Exportar XLS"}
</Button>
```

**Por que não usar `<a href={exportHref}>` direto:** o navegador não dá nenhum feedback enquanto o servidor gera o arquivo (pode envolver chamada a uma API externa lenta) — o usuário clica e não sabe se funcionou. Buscar via `fetch` e converter a resposta em blob permite controlar exatamente o início e o fim do carregamento e reagir a erros.

Ver implementação de referência em `src/client/pages/monthlyDonorsReport/index.tsx` (`handleExport` / `renderExportButton`).

## Utilitários de data

`src/lib/getMonthDates.ts` — retorna `{ firstDayOfMonth, lastDayOfMonth }` em `YYYY-MM-DD`:
- `getMonthDates(0)` → mês atual
- `getMonthDates(1)` → mês anterior
