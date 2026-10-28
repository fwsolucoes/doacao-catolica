import { useCallback, useRef, useState } from "react";
import {
  Ban,
  Copy,
  Ellipsis,
  ExternalLink,
  Link as LinkIcon,
  MessageCircle,
  Pause,
  Play,
  QrCode,
  Settings,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Progress } from "~/client/components/ui/progress";
import { useActionToast } from "~/client/hooks/useActionToast";
import { useRoot } from "~/client/hooks/useRoot";
import { CloseCampaignDialog } from "./closeCampaignDialog";

type Campaign = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  status: boolean;
  noEndDate: boolean;
  endDate: string | null;
  raised: number | null;
  goal: number | null;
  goalProgressPercentage: number | null;
  donorsCount: number | null;
};

const STATUS_BADGE: Record<
  string,
  { className: string; dotClassName: string; label: string }
> = {
  ativo: {
    className: "bg-emerald-100",
    dotClassName: "bg-emerald-500",
    label: "Ativo",
  },
  inativo: {
    className: "bg-red-100",
    dotClassName: "bg-red-500",
    label: "Inativo",
  },
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

const MENU_ITEM_CLASS = "gap-2.5 rounded-[9.2px] px-2.5 py-1.75 text-base";
const MENU_ICON_CLASS = "size-4.75 text-foreground";

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { SANCTON_DONATION_CHECKOUT_URL, CAMPAIGN_DEFAULT_IMAGE } =
    useRoot().environmentVariables;
  const navigate = useNavigate();
  const checkoutUrl = `${SANCTON_DONATION_CHECKOUT_URL}/${campaign.slug}`;
  const manageUrl = `/campaign/${campaign.id}/home`;
  const statusKey = campaign.status ? "ativo" : "inativo";
  const badge = STATUS_BADGE[statusKey];
  const [imageError, setImageError] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const closeCloseDialog = useCallback(() => setIsCloseDialogOpen(false), []);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const statusFetcher = useFetcher();
  const isUpdatingStatus = statusFetcher.state !== "idle";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${campaign.name}: ${checkoutUrl}`)}`;

  useActionToast(statusFetcher.data);

  // endDate vem do toJson() como "DD/MM/YYYY - hh:mm"
  const endDate = campaign.noEndDate ? null : campaign.endDate?.split(" ")[0];
  const subtitle = endDate
    ? `Vaquinha · até ${endDate}`
    : "Campanha Recorrente · mensal";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(checkoutUrl);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  function handleDownloadQrCode() {
    if (!qrCodeRef.current) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeRef.current.toDataURL("image/png");
    downloadLink.download = `qrcode-${campaign.slug}.png`;
    downloadLink.click();
  }

  function handleToggleStatus() {
    statusFetcher.submit(
      {
        _action: "updateCampaignStatus",
        campaignId: campaign.id,
        status: campaign.status ? "inactive" : "active",
      },
      { method: "post", action: "/my-campaigns" },
    );
  }

  return (
    <div
      className="flex cursor-pointer flex-col overflow-clip rounded-[1.1rem] border border-border/60 bg-card transition-shadow duration-300 hover:shadow-lg"
      onClick={() => navigate(manageUrl)}
    >
      <div className="relative bg-muted">
        <img
          src={campaign.image && !imageError ? campaign.image : CAMPAIGN_DEFAULT_IMAGE}
          alt={campaign.name}
          referrerPolicy="no-referrer"
          className="aspect-[1.91] w-full object-cover"
          onError={() => setImageError(true)}
        />
        <Badge
          className={`absolute top-3.5 right-3.5 gap-2 text-foreground ${badge?.className ?? "bg-muted"}`}
        >
          <span
            className={`size-1.75 rounded-full ${badge?.dotClassName ?? "bg-muted-foreground"}`}
          />
          {badge?.label ?? statusKey}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-col gap-0.5">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {campaign.name}
          </h3>
          <p className="line-clamp-1 text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3.5 pt-6">
          <div className="flex items-baseline justify-between gap-2 whitespace-nowrap">
            <p className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-foreground">
                {formatCurrency(campaign.raised)}
              </span>
              {!endDate && (
                <span className="text-base text-muted-foreground">/mês</span>
              )}
            </p>
            {campaign.goal !== null && (
              <span className="text-base text-muted-foreground">
                de {formatCurrency(campaign.goal)}
              </span>
            )}
          </div>

          <Progress
            value={Math.min(100, campaign.goalProgressPercentage ?? 0)}
            className="h-1.75"
          />

          <div className="flex items-center justify-between text-base text-muted-foreground">
            <span>
              {campaign.goalProgressPercentage !== null
                ? `${Math.round(campaign.goalProgressPercentage)}% da meta`
                : "Sem meta definida"}
            </span>
            <span>
              {campaign.donorsCount ?? "—"} doador
              {campaign.donorsCount === 1 ? "" : "es"}
            </span>
          </div>

          <div
            className="flex items-center gap-2.5 border-t border-border pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-9.5 flex-1 gap-2.5 border-border bg-muted text-xs text-foreground"
              asChild
            >
              <a href={checkoutUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={19} />
                Visualizar
              </a>
            </Button>
            <Button size="sm" className="h-9.5 flex-1 text-xs" asChild>
              <Link to={manageUrl}>
                <Settings size={19} />
                Gerenciar
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9.5 shrink-0 text-foreground"
                  aria-label="Mais ações"
                >
                  <Ellipsis size={19} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl p-1">
                <DropdownMenuItem className={MENU_ITEM_CLASS} onSelect={handleCopyLink}>
                  <LinkIcon className={MENU_ICON_CLASS} />
                  Copiar link
                </DropdownMenuItem>
                <DropdownMenuItem className={MENU_ITEM_CLASS} asChild>
                  <a href={checkoutUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className={MENU_ICON_CLASS} />
                    Ver página pública
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className={MENU_ITEM_CLASS} asChild>
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    <MessageCircle className={MENU_ICON_CLASS} />
                    Compartilhar no WhatsApp
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className={MENU_ITEM_CLASS} onSelect={handleDownloadQrCode}>
                  <QrCode className={MENU_ICON_CLASS} />
                  Baixar QR Code
                </DropdownMenuItem>
                {/* sem endpoint de duplicação na API por enquanto */}
                <DropdownMenuItem className={MENU_ITEM_CLASS} disabled>
                  <Copy className={MENU_ICON_CLASS} />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem className={MENU_ITEM_CLASS} asChild>
                  <Link to={`/campaign/${campaign.id}/settings/general-info`}>
                    <Settings className={MENU_ICON_CLASS} />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="-mx-1 bg-muted" />
                <DropdownMenuItem
                  className={MENU_ITEM_CLASS}
                  disabled={isUpdatingStatus}
                  onSelect={handleToggleStatus}
                >
                  {campaign.status ? (
                    <Pause className={MENU_ICON_CLASS} />
                  ) : (
                    <Play className={MENU_ICON_CLASS} />
                  )}
                  {campaign.status ? "Pausar" : "Retomar"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={MENU_ITEM_CLASS}
                  variant="destructive"
                  onSelect={() => setIsCloseDialogOpen(true)}
                >
                  <Ban className="size-4.75" />
                  Encerrar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CloseCampaignDialog
              campaign={campaign}
              open={isCloseDialogOpen}
              onClose={closeCloseDialog}
            />
            <QRCodeCanvas
              ref={qrCodeRef}
              value={checkoutUrl}
              size={500}
              marginSize={2}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { CampaignCard };
