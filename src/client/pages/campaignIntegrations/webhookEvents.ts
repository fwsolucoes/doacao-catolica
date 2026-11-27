/** "*" assina todos os eventos, inclusive os que forem criados no futuro. */
const ALL_EVENTS = "*";

/** Eventos selecionáveis no formulário, na ordem exibida. */
const WEBHOOK_EVENTS = [
  { id: "payment.confirmed", label: "Pagamento confirmado" },
  { id: "payment.received", label: "Pagamento recebido" },
  { id: "payment.manual", label: "Baixa manual" },
  { id: "subscription.created", label: "Assinatura criada" },
  { id: "subscription.inactivated", label: "Assinatura inativada" },
];

// Record<string, ...> para aceitar valores novos da API — o badge cai no valor bruto.
const WEBHOOK_EVENT_LABEL: Record<string, string> = {
  [ALL_EVENTS]: "Todos os eventos",
  ...Object.fromEntries(WEBHOOK_EVENTS.map((event) => [event.id, event.label])),
};

export { ALL_EVENTS, WEBHOOK_EVENT_LABEL, WEBHOOK_EVENTS };
