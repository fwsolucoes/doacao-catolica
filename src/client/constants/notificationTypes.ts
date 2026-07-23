const NOTIFICATION_TYPES: Record<string, string> = {
  subscription_created_externally: "Confirmação de cadastro (Landing page)",
  subscription_created_internally: "Confirmação de cadastro (Interno)",
  payment_paid: "Pagamento efetuado",
  donator_birthday: "Mensagem de aniversário",
  subscription_cancelled: "Cancelamento de recorrência",
  payment_before_due_date: "Lembrete antes do vencimento",
  payment_on_due_date: "Lembrete no dia do vencimento",
  payment_after_due_date: "Lembrete depois do vencimento",
};

export { NOTIFICATION_TYPES };
