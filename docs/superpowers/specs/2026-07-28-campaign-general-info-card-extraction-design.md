# Campaign General Info — Extração de Cards em Componentes Separados

## Contexto

`src/client/pages/campaignGeneralInfo/index.tsx` contém cinco seções distintas, cada uma envolvida por `SectionCard`. O arquivo cresceu para ~360 linhas e mistura lógica de estado, JSX de formulário e estrutura de página num só lugar. O objetivo é extrair cada seção em seu próprio componente, tornando o arquivo principal um orquestrador limpo.

## Estrutura de Arquivos

```
src/client/pages/campaignGeneralInfo/
├── index.tsx                        (simplificado)
├── SlugField.tsx                    (sem mudança)
└── components/
    ├── CampaignDataCard.tsx
    ├── VisibilityCard.tsx
    ├── DonationTypeCard.tsx
    ├── FundraisingGoalsCard.tsx
    └── ReceivingInstitutionCard.tsx
```

## Componentes Extraídos

### CampaignDataCard

**Props:** `campaign`, `campaignId: string`, `slugPrefix: string`

Contém: campo nome da campanha, `SlugField`, categoria (select), status (switch com `isActive`), datas de início e término, telefone do responsável.

Estado interno: `isActive` (inicializado com `campaign.status`). O valor é comunicado ao form via `<input type="hidden" name="status">`.

### VisibilityCard

**Props:** `defaultPublished: boolean`

Contém: radio group público/privado com cards clicáveis.

Estado interno: `isPublic` (inicializado com `defaultPublished`). O valor é comunicado ao form via `<input type="hidden" name="published">`.

### DonationTypeCard

**Props:** `defaultType: DonationType`

Contém: três botões de seleção de tipo de doação (Mensal, Única, Ambos).

Estado interno: `donationType` (inicializado com `defaultType`). O valor é comunicado ao form via `<input type="hidden" name="typeDonation">`.

`DonationType` e `DONATION_TYPE_OPTIONS` se movem para dentro deste arquivo — não são usados em nenhum outro lugar.

### FundraisingGoalsCard

**Props:** `campaign`

Contém: `CurrencyInput` para meta total e meta mensal. Sem estado local — usa `defaultValue` diretamente dos campos de `campaign`.

### ReceivingInstitutionCard

**Props:** `campaign`

Contém: campos de nome da instituição, CNPJ e endereço. Sem estado local — usa `defaultValue` dos campos de `campaign`.

## index.tsx Resultante

Responsabilidades restantes: `useLoaderData`, `useParams`, `useRoot`, `useFetcher`, `useActionToast`, `FormErrorProvider`, `Form`, `StepTabBar`, `StepNav` e renderização dos cinco cards. Sem nenhum estado local.

## Componente SectionCard

Permanece como função interna em cada arquivo de card que o usa. Não justifica arquivo compartilhado por ser um wrapper simples sem lógica.

## O que Não Muda

- `SlugField.tsx` permanece onde está.
- A lógica do fetcher, a action do form e o `FormErrorProvider` permanecem em `index.tsx`.
- Nenhuma alteração de comportamento ou estilo — é refactoring puro.
