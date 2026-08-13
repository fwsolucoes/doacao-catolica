const NOTIFICATION_TYPES: Record<string, string> = {
  payment_before_due_date: "Lembrete antes do vencimento",
  payment_on_due_date: "Lembrete no dia do vencimento",
  payment_after_due_date: "Lembrete depois do vencimento",
  payment_paid: "Pagamento efetuado",
  payment_settled: "Pagamento liquidado",
  credit_card_failure: "Falha no cartão de crédito",
  credit_card_created: "Cartão de crédito cadastrado",
  subscription_created_internally: "Confirmação de cadastro (Interno)",
  subscription_created_externally: "Confirmação de cadastro (Landing page)",
  default_recovery: "Recuperação de inadimplência",
  subscription_canceled: "Cancelamento de recorrência",
  donator_birthday: "Mensagem de aniversário",
  manual: "Manual",
  transfer_unpaid: "Transferência não paga",
  instant_reminder: "Lembrete instantâneo",
  donate_now: "Doe agora",
  pending_automatic_pix_authorization: "PIX automático pendente de autorização",
  inactive_donor: "Doador inativo",
};

export { NOTIFICATION_TYPES };
