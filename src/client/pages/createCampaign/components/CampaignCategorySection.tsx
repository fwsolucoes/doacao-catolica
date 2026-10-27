import { useLoaderData } from "react-router";
import { CategoryPicker } from "~/client/components/campaignSettings/categoryPicker";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import type { CreateCampaignLoader } from "~/client/types/createCampaignLoader";

function CampaignCategorySection() {
  const { projectCategories } = useLoaderData<CreateCampaignLoader>();

  return (
    <SectionCard
      title="Categoria da campanha"
      description="Escolha a categoria que melhor descreve sua campanha."
    >
      <CategoryPicker categories={projectCategories} />
    </SectionCard>
  );
}

export { CampaignCategorySection };
