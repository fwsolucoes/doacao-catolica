import { RichTextarea } from "~/client/components/campaignSettings/richTextarea";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

function WhyDonateSection() {
  return (
    <SectionCard
      title="Por que doar"
      description="Bloco que explica o propósito da campanha para os visitantes."
    >
      <FormField name="whyDonateTitle" label="Título">
        <Input name="whyDonateTitle" placeholder="Ex.: Por que sua doação importa" />
      </FormField>
      <FormField name="whyDonateText" label="Texto">
        <RichTextarea
          name="whyDonateText"
          placeholder="Explique o impacto da doação..."
        />
      </FormField>
    </SectionCard>
  );
}

export { WhyDonateSection };
