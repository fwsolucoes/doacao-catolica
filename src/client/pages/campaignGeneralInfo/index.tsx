import { useFetcher, useParams } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import { FormErrorProvider } from "~/client/components/ui/form-field";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import { CampaignDataCard } from "./components/CampaignDataCard";
import { DonationTypeCard } from "./components/DonationTypeCard";
import { FundraisingGoalsCard } from "./components/FundraisingGoalsCard";
import { ReceivingInstitutionCard } from "./components/ReceivingInstitutionCard";
import { VisibilityCard } from "./components/VisibilityCard";

function CampaignGeneralInfoPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { Form, state, data } = useFetcher();
  const isSubmitting = state === "submitting";
  useActionToast(data);

  const steps = buildSteps(campaignId!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações gerais da campanha.
        </p>
      </div>

      <StepTabBar steps={steps} />

      <div className="flex gap-8 items-start">
        <StepNav steps={steps} />

        <FormErrorProvider fieldErrors={data?.cause?.fieldErrors}>
          <Form
            method="post"
            action={`/campaign/${campaignId}/settings/general-info`}
            className="flex flex-1 flex-col gap-6 min-w-0"
          >
            <CampaignDataCard />
            <VisibilityCard />
            <DonationTypeCard />
            <FundraisingGoalsCard />
            <ReceivingInstitutionCard />

            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="updateGeneralInfo"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </Form>
        </FormErrorProvider>
      </div>
    </div>
  );
}

export { CampaignGeneralInfoPage };
