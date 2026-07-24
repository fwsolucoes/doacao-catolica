export type Channel = "email" | "whatsapp" | "sms" | "ligacao";
export type PaymentMethod = "pix" | "boleto" | "cartao";

export type BillingRule = {
  id: string;
  name: string;
  description: string;
  channels: Channel[];
  paymentMethods: PaymentMethod[];
  active: boolean;
};

export type NotificationHistory = {
  id: string;
  customerName: string;
  contact: string;
  channel: string;
  message: string;
  errorMessage?: string;
  date: string;
  time: string;
  status: string;
};
