import { Mail, MessageSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

const CHANNEL_BADGE: Record<string, { label: string; className: string }> = {
  email: { label: "E-mail", className: "bg-[#ede0ff] text-[#6b21a8]" },
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1e40af]" },
  ligacao: { label: "Ligação", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

const PAYMENT_BADGE: Record<string, { label: string; className: string }> = {
  pix: { label: "Pix", className: "bg-[#cbfbf1] text-[#00786f]" },
  boleto: { label: "Boleto", className: "bg-[#e2e8f0] text-[#314158]" },
  bank_slip: { label: "Boleto", className: "bg-[#e2e8f0] text-[#314158]" },
  cartao: { label: "Cartão", className: "bg-[#e0e7ff] text-[#432dd7]" },
  credit_card: { label: "Cartão", className: "bg-[#e0e7ff] text-[#432dd7]" },
};

const HISTORY_CHANNEL_STYLE: Record<string, { label: string; className: string }> = {
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1447e6]" },
  email: { label: "E-mail", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

function ChannelBadge({ channel }: { channel: string }) {
  const style = CHANNEL_BADGE[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style?.className ?? "bg-muted text-muted-foreground",
      )}
    >
      {style?.label ?? channel}
    </span>
  );
}

function PaymentBadge({ method }: { method: string }) {
  const style = PAYMENT_BADGE[method];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style?.className ?? "bg-muted text-muted-foreground",
      )}
    >
      {style?.label ?? method}
    </span>
  );
}

function HistoryChannelBadge({ channel }: { channel: string }) {
  const style = HISTORY_CHANNEL_STYLE[channel] ?? {
    label: channel,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        style.className,
      )}
    >
      {channel === "whatsapp" && <WhatsAppIcon size={14} />}
      {channel === "sms" && <MessageSquare size={14} />}
      {channel === "email" && <Mail size={14} />}
      {style.label}
    </span>
  );
}

export { ChannelBadge, PaymentBadge, HistoryChannelBadge };
