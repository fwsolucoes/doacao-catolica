# Design: Switch de ativação nos cards "Por que doar" e "Sobre nós"

## Contexto

Na tela de configurações → item **Página da Campanha**, os cards "Por que doar" e "Sobre nós" exibem campos de título, texto e imagem. O objetivo é adicionar um switch em cada card que, quando desativado, desabilita visualmente todos os campos daquele card. O estado de ativação é persistido na API via dois novos campos booleanos.

## Comportamento esperado

- O switch aparece no canto superior direito do header do card (slot `action` do `SectionCard`).
- Estado inicial: ativado se `preferences.whyDonateEnabled ?? true` (idem para `aboutUsEnabled`).
- Quando o switch está **desativado**: os campos ficam com `pointer-events-none opacity-50` — visualmente inerte, mas seus valores permanecem no FormData e são submetidos normalmente.
- Ao salvar, `whyDonateEnabled` / `aboutUsEnabled` são enviados como parte do form e persistidos na API. A lógica de exibir ou não a seção na página pública é responsabilidade do backend/frontend de checkout.

## Campos novos na API

| Campo API | Tipo | Mapeamento interno |
|---|---|---|
| `why_donate_enabled` | `boolean \| null` | `whyDonateEnabled` |
| `about_us_enabled` | `boolean \| null` | `aboutUsEnabled` |

## Camadas alteradas

### 1. External schema — `infra/schemas/external/campaignPreferences.ts`

Adicionar:
```ts
why_donate_enabled: z.boolean().nullable().optional().transform((v) => v ?? null),
about_us_enabled: z.boolean().nullable().optional().transform((v) => v ?? null),
```

### 2. Domain types — `domain/gateways/campaignPreferences.ts`

Adicionar em `CampaignPreferences`:
```ts
whyDonateEnabled: boolean | null;
aboutUsEnabled: boolean | null;
```

Adicionar em `UpdateCampaignPreferencesInput`:
```ts
whyDonateEnabled: boolean | null;
aboutUsEnabled: boolean | null;
```

### 3. Infra gateway — `infra/gateways/campaignPreferences.ts`

**`getCampaignPreferences`** — mapear os novos campos:
```ts
whyDonateEnabled: data.why_donate_enabled,
aboutUsEnabled: data.about_us_enabled,
```

**`updateCampaignPreferences`** — incluir no body (e descomentar os outros campos que já estavam pendentes):
```ts
why_donate_enabled: input.whyDonateEnabled,
about_us_enabled: input.aboutUsEnabled,
```

### 4. Internal schema — `infra/schemas/internal/campaign.ts`

O switch submete strings `"true"` / `"false"` via hidden input. Transformar:
```ts
whyDonateEnabled: z.string().transform((v) => v === "true"),
aboutUsEnabled: z.string().transform((v) => v === "true"),
```

### 5. Use case — `app/useCases/campaign/updateCampaignPageUseCase.ts`

Adicionar em `InputProps`:
```ts
whyDonateEnabled: boolean;
aboutUsEnabled: boolean;
```

Passar ao gateway em `updateCampaignPreferences`:
```ts
whyDonateEnabled: input.whyDonateEnabled,
aboutUsEnabled: input.aboutUsEnabled,
```

### 6. Componentes — `WhyDonateSection` e `AboutUsSection`

Padrão idêntico para ambos (exemplo com `WhyDonateSection`):

```tsx
function WhyDonateSection() {
  const { preferences } = useLoaderData<CampaignPageLoader>();
  const [enabled, setEnabled] = useState(preferences.whyDonateEnabled ?? true);

  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha."
      action={
        <>
          <input type="hidden" name="whyDonateEnabled" value={enabled ? "true" : "false"} />
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </>
      }
    >
      <div className={cn(!enabled && "pointer-events-none opacity-50")}>
        {/* FormFields existentes sem alteração */}
      </div>
    </SectionCard>
  );
}
```

- `Switch` vem de `~/client/components/ui/switch`
- O hidden input garante que o valor seja incluído no FormData
- Não usar `SwitchField` (tem label + layout horizontal — inadequado para o header do card)
- Não usar `fieldset disabled` (exclui valores do FormData)

## O que NÃO muda

- `SectionCard` — já tem o prop `action`, nenhuma alteração
- Controller — já passa `...validated` direto ao use case
- Rota — nenhuma alteração
- Outros cards da página (`PageContentSection`, `MediasSection`, `SupportChannelsSection`)
