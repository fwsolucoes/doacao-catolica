import type { BillingRule, NotificationHistory } from "./types";

export const TEMPLATE_VARIABLES = [
  { label: "Nome do Contato", value: "{{nome}}" },
  { label: "Razão Social", value: "{{razao_social}}" },
  { label: "Nome Fantasia", value: "{{nome_fantasia}}" },
  { label: "CPF / CNPJ", value: "{{cpf_cnpj}}" },
  { label: "Código do Cliente", value: "{{codigo_cliente}}" },
  { label: "Email do Cliente", value: "{{email_cliente}}" },
  { label: "Telefone do Cliente", value: "{{telefone_cliente}}" },
  { label: "Valor Total", value: "{{valor_total}}" },
  { label: "Valor em Aberto", value: "{{valor_aberto}}" },
  { label: "Valor Pago", value: "{{valor_pago}}" },
  { label: "Valor com Desconto", value: "{{valor_desconto}}" },
  { label: "Data de Vencimento", value: "{{data_vencimento}}" },
  { label: "Vencimento Ajustado", value: "{{vencimento_ajustado}}" },
  { label: "Dias p/ Vencimento", value: "{{dias_vencimento}}" },
  { label: "Nome da Conta", value: "{{account_name}}" },
  { label: "Link WhatsApp", value: "{{link_whatsapp}}" },
];

export const WHATSAPP_DEFAULT = `Lembrete de vencimento
Olá {{nome}},
Gostaríamos de lembrar que vencerá em {{data_vencimento}} o título no valor de R$ {{valor_aberto}} ref. {{account_name}}.
Estamos à disposição, entre em contato conosco pelo link abaixo:
https://wa.me/55{{link_whatsapp}}
Obrigado`;

export const EMAIL_BODY_DEFAULT =
  "Olá {{nome}},\n\nEste é um lembrete do seu pagamento.\n\nAtenciosamente.";

export const SMS_DEFAULT =
  `Caro cliente, consta débito vencido em: {{data_vencimento}}, R$ {{valor_aberto}}, Att,` +
  `\n{{account_name}}-Tel.{{telefone_contato}}-{{email_contato}}`;

export const BILLING_RULE_TYPES = new Set([
  "payment_before_due_date",
  "payment_on_due_date",
  "payment_after_due_date",
  "instant_reminder",
]);

export const BILLING_RULES: BillingRule[] = [
  {
    id: "1",
    name: "Cobrança - 3 dias antes",
    description: "Lembrete X dias antes do vencimento (3 dias)",
    channels: ["email", "whatsapp"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "2",
    name: "Cobrança - 1º aviso",
    description: "Cobrança X dias após vencimento (no dia)",
    channels: ["email", "whatsapp", "sms"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: true,
  },
  {
    id: "3",
    name: "Cobrança - 2º aviso",
    description: "Cobrança X dias após vencimento (3 dias)",
    channels: ["whatsapp", "sms"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "4",
    name: "Cobrança - 3º aviso",
    description: "Cobrança X dias após vencimento (7 dias)",
    channels: ["email", "whatsapp", "ligacao"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: false,
  },
];

export const NOTIFICATION_HISTORY: NotificationHistory[] = [
  {
    id: "1",
    customerName: "João Silva",
    contact: "(11) 98765-4321",
    channel: "whatsapp",
    message: "Cobrança - 3 dias antes",
    date: "19/05/2026",
    time: "05:00:00",
    status: "delivered",
  },
  {
    id: "2",
    customerName: "Maria Santos",
    contact: "(21) 99123-4567",
    channel: "whatsapp",
    message: "Agradecimento (recorrência)",
    date: "20/05/2026",
    time: "11:30:00",
    status: "delivered",
  },
  {
    id: "3",
    customerName: "Pedro Oliveira",
    contact: "(31) 98888-7777",
    channel: "sms",
    message: "Cobrança - 2º aviso",
    date: "21/05/2026",
    time: "06:15:00",
    status: "delivered",
  },
  {
    id: "4",
    customerName: "João Silva",
    contact: "joao.silva@email.com",
    channel: "email",
    message: "Cobrança - 3 dias antes",
    date: "21/05/2026",
    time: "07:00:00",
    status: "sent",
  },
  {
    id: "5",
    customerName: "Ana Costa",
    contact: "(41) 97777-6666",
    channel: "sms",
    message: "Cobrança - 1º aviso",
    errorMessage: "Número de telefone inválido",
    date: "22/05/2026",
    time: "08:00:00",
    status: "failed",
  },
];
