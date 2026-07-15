# Schemas — convenções Zod v4

## Validação de UUID

Usar `z.uuid()` standalone, **não** `z.string().uuid()` (preterido no Zod v4).

```ts
// correto
subscriptionUuid: z.uuid({ message: "UUID inválido" })
subscriptionUuid: z.uuid()   // sem mensagem customizada

// errado — preterido no Zod v4
subscriptionUuid: z.string().uuid("UUID inválido")
subscriptionUuid: z.string().uuid()
```
