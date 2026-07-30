import { ArrowRight, CircleCheck, Eye, Settings, Sparkles } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { Button } from "~/client/components/ui/button";
import type { CampaignCreatedLoader } from "~/client/types/campaignCreatedLoader";

function CampaignCreatedPage() {
  const { campaign } = useLoaderData<CampaignCreatedLoader>();
  const { environmentVariables } = useRoot();

  const checkoutBase = environmentVariables.SANCTON_DONATION_CHECKOUT_URL.endsWith("/")
    ? environmentVariables.SANCTON_DONATION_CHECKOUT_URL
    : `${environmentVariables.SANCTON_DONATION_CHECKOUT_URL}/`;
  const viewUrl = `${checkoutBase}${campaign.slug}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-12rem)] py-2 sm:py-8">
      <div className="w-full max-w-xl bg-background border border-border rounded-[17px] overflow-hidden">
        <div className="relative flex flex-col items-center gap-4 pb-6 pt-8 px-5 sm:pb-10 sm:pt-12 sm:px-12">
          <div className="absolute top-0 left-0 right-0 h-1.75 bg-primary" />

          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleCheck size={48} className="text-primary" />
          </div>

          <div className="flex flex-col items-center pt-2">
            <h1 className="text-3xl font-semibold text-foreground text-center leading-9 tracking-tight">
              Campanha criada com sucesso!
            </h1>
          </div>

          <p className="text-muted-foreground text-base text-center max-w-md pb-2">
            Sua campanha já está no ar e pronta para receber doações.
            <br />
            Você pode ajustar detalhes a qualquer momento.
          </p>

          <div className="flex items-center gap-1.5 bg-muted border border-border/50 px-4 py-1.5 rounded-full">
            <Sparkles size={14} className="text-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {campaign.published ? "Publicada" : "Não publicada"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-5 pb-6 px-5 sm:gap-7 sm:pt-7 sm:pb-10 sm:px-12">
          <div className="border border-border rounded-[13px] p-5 bg-muted/30">
            <p className="text-muted-foreground text-base leading-6.5">
              Ainda não acabou: você pode configurar outros detalhes da campanha
              — como mensagens automáticas, integrações, e-mail, WhatsApp e SEO
              — acessando as{" "}
              <strong className="text-foreground font-semibold">Configurações</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              className="flex-1 border border-input"
              asChild
            >
              <Link to={`/campaign/${campaign.id}/settings/general-info`}>
                <Settings size={18} />
                Configurações
              </Link>
            </Button>

            <Button className="flex-1" asChild>
              <a href={viewUrl} target="_blank" rel="noopener noreferrer">
                <Eye size={18} />
                Visualizar campanha
                <ArrowRight size={18} />
              </a>
            </Button>
          </div>

          <div className="flex justify-center">
            <Link
              to="/my-campaigns"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2.5 rounded-[11px]"
            >
              Voltar para lista de campanhas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CampaignCreatedPage };
