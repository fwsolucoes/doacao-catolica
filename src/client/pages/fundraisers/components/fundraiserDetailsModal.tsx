import {
  CalendarDays,
  RefreshCw,
  TrendingDown,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import type { Fundraiser } from "../types";

type FundraiserDetailsModalProps = {
  fundraiser: Fundraiser | null;
  onClose: () => void;
};

type StatCard = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
};

const STAT_CARDS: StatCard[] = [
  {
    icon: Users,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-blue-500",
    label: "Total de doadores indicados",
    value: "19",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-emerald-500",
    label: "Total mensal (recorrência)",
    value: "R$ 940,00",
  },
  {
    icon: CalendarDays,
    iconBg: "bg-[#fffbeb]",
    iconColor: "text-amber-500",
    label: "Total do último mês",
    value: "R$ 1.310,00",
  },
  {
    icon: UserPlus,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-violet-500",
    label: "Novos doadores indicados",
    value: "2",
    sub: "no último mês",
  },
  {
    icon: TrendingDown,
    iconBg: "bg-[#fff1f2]",
    iconColor: "text-rose-500",
    label: "Comparação com mês anterior",
    value: "-13,8%",
    sub: "Mês anterior: R$ 1.520,00",
  },
  {
    icon: Wallet,
    iconBg: "bg-[#f1f5f9]",
    iconColor: "text-slate-500",
    label: "Total de comissões recebidas",
    value: "R$ 91,70",
  },
];

function FundraiserDetailsModal({
  fundraiser,
  onClose,
}: FundraiserDetailsModalProps) {
  const commission =
    fundraiser?.commission && fundraiser.commission !== "—"
      ? `comissão de ${fundraiser.commission}`
      : "sem comissão definida";

  return (
    <Dialog open={!!fundraiser} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Detalhes de indicações</DialogTitle>
          <p className="text-base text-muted-foreground">
            {fundraiser?.name} · {fundraiser?.email} · {commission}
          </p>
        </DialogHeader>

        <div className="overflow-y-auto overscroll-contain px-8 py-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex flex-col gap-3 rounded-2xl border border-border p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <card.icon size={19} className={card.iconColor} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      {card.label}
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                      {card.value}
                    </span>
                    {card.sub && (
                      <span className="text-xs text-muted-foreground">
                        {card.sub}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
          <DialogClose asChild>
            <Button variant="outline" className="border-border bg-muted text-foreground">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { FundraiserDetailsModal };
