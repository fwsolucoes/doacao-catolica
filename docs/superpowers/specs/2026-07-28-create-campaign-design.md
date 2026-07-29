# Create Campaign Page — Design Spec

**Date:** 2026-07-28  
**Scope:** Frontend only. Backend action placeholder; real submission wired when backend is ready.  
**Figma:** [Nova campanha — node 450:715](https://www.figma.com/design/KGqip4P0oxGFMHhUAb2JtO/Doa%C3%A7%C3%A3o-Cat%C3%B3lica?node-id=450-715&m=dev)

---

## Route

Added under `layout.portalLayout` in `src/routes.ts`:

```ts
route("my-campaigns/create", "./main/routes/route.createCampaign.tsx")
```

URL: `/my-campaigns/create` — reached via the existing `<Link to="create">` in `myCampaigns/index.tsx`.

### Route file (`src/main/routes/route.createCampaign.tsx`)

- **loader**: redirects to `/sign-in` if user is not authenticated.
- **action**: placeholder — returns `null`. Handles `_action: "verifySlug"` by delegating to `verifySlug` factory (reuses existing controller). The `createCampaign` case returns `null` until the backend is implemented.
- **ErrorBoundary**: `<ErrorBoundaryPage />`.
- Default export: `<CreateCampaignPage />`.

---

## File Structure

```
src/client/pages/createCampaign/
  index.tsx
  CreateSlugField.tsx
  components/
    DonationTypeSection.tsx
    CampaignDataSection.tsx
    VisibilitySection.tsx
    FundraisingGoalsSection.tsx
    ReceivingInstitutionSection.tsx
    PageContentSection.tsx
    MediasSection.tsx
    WhyDonateSection.tsx
```

---

## Page Component (`index.tsx`)

```
[← back]  Nova campanha
          Preencha as informações abaixo para publicar sua campanha.

<Form method="post" className="flex flex-col gap-6">
  <DonationTypeSection />
  <CampaignDataSection />
  <VisibilitySection />
  <FundraisingGoalsSection />
  <ReceivingInstitutionSection />
  <PageContentSection />
  <MediasSection />
  <WhyDonateSection />

  <div className="flex justify-end">
    <Button type="submit" name="_action" value="createCampaign">
      Criar campanha
    </Button>
  </div>
</Form>
```

- Uses `useFetcher()` — destructures `{ Form, state, data }`. `Form` posts to `/my-campaigns/create`.
- `useActionToast(data)` for submission feedback.
- Back button: `<Button variant="outline" asChild><Link to="/my-campaigns"><ChevronLeft /> Voltar</Link></Button>`.
- `slugPrefix` computed from `useRoot().environmentVariables.SANCTON_DONATION_CHECKOUT_URL` and passed to `<CampaignDataSection slugPrefix={slugPrefix} />`.
- All sections wrapped in `<FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>`.

---

## Section Components

All sections use `SectionCard` from `~/client/components/campaignSettings/sectionCard` (has `title` + `description` props). No section reads from `useLoaderData`.

### `DonationTypeSection`
- State: `donationType: "MONTHLY" | "ONETIME" | "BOTH"` — default `"BOTH"`.
- Renders 3 `<Button variant="ghost">` cards, each with a lucide icon + label + description.
  - Mensal → `RefreshCw`
  - Única → `Zap`
  - Ambas → `Layers`
- Selected card: `border-primary bg-primary/5`. Unselected: `border-border hover:bg-muted/50`.
- `<input type="hidden" name="typeDonation" value={donationType} />`

### `CampaignDataSection`
- Props: `slugPrefix: string` (passed from `index.tsx` which reads `useRoot().environmentVariables.SANCTON_DONATION_CHECKOUT_URL`).
- State: `isActive: boolean` — default `true`.
- Fields:
  - **Nome da campanha** — `<Input name="name" placeholder="Ex.: Reforma da Paróquia São José" required />`
  - **Slug (URL)** — `<CreateSlugField slugPrefix={slugPrefix} />`
  - **Categoria** + **Status** — 2-column grid. Categoria: `<Select name="category">` with options Paróquia / Comunidade / Missão / Outro. Status: bordered row with label + `<Switch>` + `<input hidden name="status">`.
  - **Data de início** + **Data de término** — 2-column grid. `<InputGroup>` with `<Calendar>` icon + `<input type="date">` on muted background.
  - **WhatsApp** — `<Input name="phone" type="tel" placeholder="(11) 90000-0000" />` with helper text below.

### `VisibilitySection`
- State: `isPublic: boolean` — default `true`.
- `<RadioGroup>` with 2 card-style labels: Pública / Privada.
- `<input type="hidden" name="published" value={isPublic ? "true" : "false"} />`

### `FundraisingGoalsSection`
- 2-column grid: **Meta total** + **Meta mensal** — both `<CurrencyInput>`, both optional.
- Names: `totalGoal`, `monthlyGoal`.

### `ReceivingInstitutionSection`
- Fields (all optional `<Input>`):
  - **CNPJ / CPF** (`name="cnpj"`)
  - **Nome / Razão social** (`name="institutionName"`)
  - 2-col: **CEP** + **Endereço**
  - 2-col: **Número** + **Complemento**
  - 3-col: **Bairro** / **Cidade** / **Estado**
- Note: CEP, Número, Complemento, Bairro, Cidade, Estado are UI-only fields for now; they will be assembled into the `address` string when the backend action is implemented.

### `PageContentSection`
- **Título** — `<Input name="title" placeholder="Ex.: Ajude a reformar nossa paróquia" />`
- **Texto principal** — `<Textarea name="description" placeholder="Descrição curta..." className="min-h-24" />`

### `MediasSection`
- **Imagem desktop** — `<ImageUploadCompact name="image" width={1400} height={433} />`
- **Imagem mobile** — `<ImageUploadCompact name="imageMobile" width={400} height={300} />`
- **Vídeo destaque** — `<InputGroup>` with `<Play>` icon + text input (`name="videoUrl"`). Helper text: "Cole a URL do YouTube."
- **Imagem cabeçalho** — `<ImageUploadCompact name="headerImage" />`

### `WhyDonateSection`
- **Título** — `<Input name="whyDonateTitle" />`
- **Texto** — `<RichTextarea name="whyDonateText" />`

---

## `CreateSlugField`

Adapted from `campaignGeneralInfo/SlugField`. Key difference: posts to `/my-campaigns/create` instead of a campaign-specific route.

- Uses `useFetcher` to POST `{ slug, _action: "verifySlug" }` to `/my-campaigns/create`.
- Displays ✓ (available) or ✗ (in use) feedback below the input.
- Generates slug from the campaign name via `generateSlug` utility.
- Props: `slugPrefix: string`.

---

## Post-Creation Redirect (future)

When the backend action is implemented:
- `createCampaign` action will call `POST /project/create` and receive the new campaign `id`.
- Route action will return `redirect(`/campaign/${id}/home`)`.
- `useActionToast` will display success toast before redirect.
