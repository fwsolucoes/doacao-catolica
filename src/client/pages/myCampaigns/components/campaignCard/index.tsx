import { Eye, ImageOff, Settings, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Progress } from "~/client/components/ui/progress";

type Campaign = {
  id: string;
  name: string;
  image: string | null;
  status: boolean;
  currentRevenue: string | null;
  totalGoal: string | null;
};

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  ativo: { className: "bg-emerald-100 text-emerald-700", label: "Ativo" },
  inativo: { className: "bg-muted text-muted-foreground", label: "Inativo" },
};

function formatCurrency(value: string | null | undefined): string {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function getProgress(
  current: string | null | undefined,
  goal: string | null,
): number {
  if (!current || !goal) return 0;
  const c = parseFloat(current);
  const g = parseFloat(goal);
  if (isNaN(c) || isNaN(g) || g === 0) return 0;
  return Math.min(100, Math.round((c / g) * 100));
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusKey = campaign.status ? "ativo" : "inativo";
  const badge = STATUS_BADGE[statusKey];
  const progress = getProgress(campaign.currentRevenue, campaign.totalGoal);

  return (
    <div className="overflow-clip rounded-[1.1rem] border border-border bg-card flex flex-col">
      <div className="relative">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.name}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-muted">
            <ImageOff size={32} className="text-muted-foreground/40" />
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-4 py-1 text-sm ${badge?.className ?? "bg-muted text-muted-foreground"}`}
        >
          {badge?.label ?? statusKey}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {campaign.name}
        </h3>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Arrecadado</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(campaign.currentRevenue)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs text-muted-foreground">Meta</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(campaign.totalGoal)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Progress value={progress} className="h-2.5" />
          <span className="text-xs text-sidebar-primary">
            {progress}% da meta
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={14} />
            <span>apoiadores</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-xl"
              aria-label="Visualizar campanha"
            >
              <Eye size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-xl"
              aria-label="Configurar campanha"
              asChild
            >
              <Link to={`/campaign/${campaign.id}/home`}>
                <Settings size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CampaignCard };
