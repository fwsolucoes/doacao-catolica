const TEMPLATE_TYPES: { value: string; label: string }[] = [
  { value: "payment_before_due_date", label: "Pagamento antes do vencimento" },
  { value: "payment_on_due_date", label: "Pagamento no vencimento" },
  { value: "payment_after_due_date", label: "Pagamento após o vencimento" },
  { value: "payment_paid", label: "Pagamento realizado" },
  { value: "payment_settled", label: "Pagamento liquidado" },
  { value: "subscription_created_internally", label: "Assinatura criada internamente" },
  { value: "subscription_created_externally", label: "Assinatura criada externamente" },
  { value: "default_recovery", label: "Recuperação padrão" },
  { value: "subscription_canceled", label: "Assinatura cancelada" },
  { value: "donator_birthday", label: "Aniversário do doador" },
  { value: "instant_reminder", label: "Lembrete instantâneo" },
  { value: "credit_card_created", label: "Cartão de crédito cadastrado" },
  { value: "donate_now", label: "Doe agora" },
  {
    value: "pending_automatic_pix_authorization",
    label: "Autorização Pix automático pendente",
  },
];

const TEMPLATE_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  TEMPLATE_TYPES.map((t) => [t.value, t.label]),
);

export { TEMPLATE_TYPES, TEMPLATE_TYPE_LABEL };
