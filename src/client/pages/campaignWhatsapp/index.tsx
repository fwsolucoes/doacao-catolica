import { useParams } from "react-router";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import { WhatsAppConnectionSection } from "./whatsapp-connection";

function CampaignWhatsappPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações desta campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex items-start gap-8">
        <StepNav steps={steps} />
        <WhatsAppConnectionSection />
      </div>
    </div>
  );
}

export { CampaignWhatsappPage };
