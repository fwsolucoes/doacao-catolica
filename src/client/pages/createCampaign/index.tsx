import { ChevronLeft } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider } from "~/client/components/ui/form-field";
import { CampaignDataSection } from "./components/CampaignDataSection";
import { DonationRulesSection } from "./components/DonationRulesSection";
import { DonationTypeSection } from "./components/DonationTypeSection";
import { FundraisingGoalsSection } from "./components/FundraisingGoalsSection";
import { MediasSection } from "./components/MediasSection";
import { PageContentSection } from "./components/PageContentSection";
import { PaymentMethodsSection } from "./components/PaymentMethodsSection";
import { ReceivingInstitutionSection } from "./components/ReceivingInstitutionSection";
import { SobreNosSection } from "./components/SobreNosSection";
import { SuggestedValuesSection } from "./components/SuggestedValuesSection";
import { SupportChannelsSection } from "./components/SupportChannelsSection";
import { VisibilitySection } from "./components/VisibilitySection";
import { WhyDonateSection } from "./components/WhyDonateSection";

function CreateCampaignPage() {
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start gap-4">
        <Button variant="outline" size="icon" asChild className="mt-0.5 shrink-0 rounded-[11px]">
          <Link to="/my-campaigns">
            <ChevronLeft size={18} />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Nova campanha
          </h1>
          <p className="text-sm text-muted-foreground">
            Preencha as informações abaixo para publicar sua campanha.
          </p>
        </div>
      </header>

      <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
        <Form method="post" className="flex flex-col gap-6">
          <DonationTypeSection />
          <CampaignDataSection />
          <VisibilitySection />
          <FundraisingGoalsSection />
          <ReceivingInstitutionSection />
          <PageContentSection />
          <MediasSection />
          <WhyDonateSection />
          <SobreNosSection />
          <SupportChannelsSection />
          <PaymentMethodsSection />
          <DonationRulesSection />
          <SuggestedValuesSection />

          <div className="flex justify-end">
            <Button
              type="submit"
              name="_action"
              value="createCampaign"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar campanha"}
            </Button>
          </div>
        </Form>
      </FormErrorProvider>
    </div>
  );
}

export { CreateCampaignPage };
