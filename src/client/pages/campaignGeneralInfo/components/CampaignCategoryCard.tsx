import { useLoaderData } from "react-router";
import { CategoryPicker } from "~/client/components/campaignSettings/categoryPicker";
import { Card } from "~/client/components/ui/card";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";

function CampaignCategoryCard() {
  const { campaign, projectCategories } =
    useLoaderData<CampaignGeneralInfoLoader>();

  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">
          Categoria da Campanha
        </h2>
        <p className="text-sm text-muted-foreground">
          Escolha a categoria que melhor descreve sua campanha.
        </p>
      </div>
      <CategoryPicker
        categories={projectCategories}
        defaultValue={campaign.projectCategoryId}
      />
    </Card.Root>
  );
}

export { CampaignCategoryCard };
