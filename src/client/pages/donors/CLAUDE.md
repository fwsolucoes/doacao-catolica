# Donors page — convenções

## Dados do loader

Os componentes filhos desta página (`DonorsSummaryCards`, `DonorsTable`) chamam `useLoaderData<DonorsLoader>()` internamente. Não passe dados do loader como props — o componente os lê diretamente da rota.

```tsx
// correto
<DonorsSummaryCards />
<DonorsTable />

// errado — prop desnecessária
<DonorsSummaryCards summary={summary} />
```
