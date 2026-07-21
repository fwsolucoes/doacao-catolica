import { ExternalLink } from "lucide-react";
import { useFetcher, useLoaderData, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { useRoot } from "~/client/hooks/useRoot";
import { buildSteps, StepNav, StepTabBar } from "~/client/components/campaignSettings/stepNav";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider } from "~/client/components/ui/form-field";
import type { CampaignPageLoader } from "~/client/types/campaignPageLoader";
import { AboutUsSection } from "./aboutUsSection";
import { MediasSection } from "./mediasSection";
import { PageContentSection } from "./pageContentSection";
import { SupportChannelsSection } from "./supportChannelsSection";
import { WhyDonateSection } from "./whyDonateSection";

function CampaignPagePage() {
  const { campaign } = useLoaderData<CampaignPageLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { SANCTON_DONATION_CHECKOUT_URL } = useRoot().environmentVariables;
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);

  const steps = buildSteps(campaignId!);
  const campaignUrl = `${SANCTON_DONATION_CHECKOUT_URL.replace(/\/$/, "")}/${campaign.slug}`;

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

      <div className="flex gap-8 items-start">
        <StepNav steps={steps} />

        <div className="flex flex-1 flex-col gap-6 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold text-foreground">
                Página da campanha
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure o conteúdo público e visualize como ficará para os
                doadores.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <a href={campaignUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={15} />
                Visualizar página
              </a>
            </Button>
          </div>

          <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
            <Form
              method="post"
              encType="multipart/form-data"
              action={`/campaign/${campaignId}/settings/campaign-page`}
              className="flex flex-col gap-6"
            >
              <PageContentSection />
              <MediasSection />
              <WhyDonateSection />
              <AboutUsSection />
              <SupportChannelsSection />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  name="_action"
                  value="updateCampaignPage"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </Form>
          </FormErrorProvider>
        </div>
      </div>
    </div>
  );
}

export { CampaignPagePage };
