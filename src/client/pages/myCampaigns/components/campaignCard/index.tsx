import { useState } from "react";
import { Eye, Settings, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Progress } from "~/client/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";
import { useRoot } from "~/client/hooks/useRoot";

type Campaign = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  status: boolean;
  raised: number | null;
  goal: number | null;
  goalProgressPercentage: number | null;
  donorsCount: number | null;
};

const STATUS_BADGE: Record<string, { variant: "success" | "neutral"; label: string }> = {
  ativo: { variant: "success", label: "Ativo" },
  inativo: { variant: "neutral", label: "Inativo" },
};

function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { SANCTON_DONATION_CHECKOUT_URL, CAMPAIGN_DEFAULT_IMAGE } =
    useRoot().environmentVariables;
  const navigate = useNavigate();
  const checkoutUrl = `${SANCTON_DONATION_CHECKOUT_URL}/${campaign.slug}`;
  const manageUrl = `/campaign/${campaign.id}/home`;
  const statusKey = campaign.status ? "ativo" : "inativo";
  const badge = STATUS_BADGE[statusKey];
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="overflow-clip rounded-[1.1rem] border border-border bg-card flex flex-col transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => navigate(manageUrl)}
    >
      <div className="relative">
        <img
          src={campaign.image && !imageError ? campaign.image : CAMPAIGN_DEFAULT_IMAGE}
          alt={campaign.name}
          referrerPolicy="no-referrer"
          className="aspect-video w-full object-cover"
          onError={() => setImageError(true)}
        />
        <Badge
          variant={badge?.variant ?? "neutral"}
          className="absolute right-3 top-3"
        >
          {badge?.label ?? statusKey}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {campaign.name}
        </h3>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Arrecadado</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(campaign.raised)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs text-muted-foreground">Meta</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(campaign.goal)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {campaign.goalProgressPercentage !== null && (
            <Progress
              value={campaign.goalProgressPercentage}
              className="h-2.5"
            />
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-sidebar-primary">
              {campaign.goalProgressPercentage !== null
                ? `${Math.round(campaign.goalProgressPercentage)}% da meta`
                : ""}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={14} />
              <span>
                {campaign.donorsCount ?? "—"} apoiador
                {campaign.donorsCount === 1 ? "" : "es"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-xl"
                    aria-label="Visualizar campanha"
                    asChild
                  >
                    <a href={checkoutUrl} target="_blank" rel="noreferrer">
                      <Eye size={18} />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Visualizar campanha</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-3"
              aria-label="Configurar campanha"
              asChild
            >
              <Link to={manageUrl}>
                <Settings size={18} />
                Gerenciar<span className="hidden min-[350px]:inline"> Campanha</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CampaignCard };
