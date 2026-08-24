import { Mail, MessageSquare } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

const CHANNEL_BADGE: Record<
  string,
  { variant: "violet" | "success" | "navy" | "warning"; label: string }
> = {
  email: { variant: "violet", label: "E-mail" },
  whatsapp: { variant: "success", label: "WhatsApp" },
  sms: { variant: "navy", label: "SMS" },
  ligacao: { variant: "warning", label: "Ligação" },
};

const PAYMENT_BADGE: Record<
  string,
  { variant: "success" | "neutral" | "violet"; label: string }
> = {
  pix: { variant: "success", label: "Pix" },
  boleto: { variant: "neutral", label: "Boleto" },
  bank_slip: { variant: "neutral", label: "Boleto" },
  cartao: { variant: "violet", label: "Cartão" },
  credit_card: { variant: "violet", label: "Cartão" },
};

const HISTORY_CHANNEL_BADGE: Record<
  string,
  { variant: "success" | "navy" | "amber"; label: string }
> = {
  whatsapp: { variant: "success", label: "WhatsApp" },
  sms: { variant: "navy", label: "SMS" },
  email: { variant: "amber", label: "E-mail" },
};

function ChannelBadge({ channel }: { channel: string }) {
  const config = CHANNEL_BADGE[channel];
  return (
    <Badge variant={config?.variant ?? "neutral"}>
      {config?.label ?? channel}
    </Badge>
  );
}

function PaymentBadge({ method }: { method: string }) {
  const config = PAYMENT_BADGE[method];
  return (
    <Badge variant={config?.variant ?? "neutral"}>
      {config?.label ?? method}
    </Badge>
  );
}

function HistoryChannelBadge({ channel }: { channel: string }) {
  const config = HISTORY_CHANNEL_BADGE[channel];
  return (
    <Badge variant={config?.variant ?? "neutral"}>
      {channel === "whatsapp" && <WhatsAppIcon size={14} data-icon="inline-start" />}
      {channel === "sms" && <MessageSquare size={14} data-icon="inline-start" />}
      {channel === "email" && <Mail size={14} data-icon="inline-start" />}
      {config?.label ?? channel}
    </Badge>
  );
}

export { ChannelBadge, PaymentBadge, HistoryChannelBadge };
