import { useState } from "react";
import { Calendar } from "lucide-react";
import { useLoaderData } from "react-router";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { InputGroup } from "~/client/components/ui/input-group";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import type { CreateCampaignLoader } from "~/client/types/createCampaignLoader";
import { CreateSlugField } from "../CreateSlugField";

function CampaignDataSection() {
  const { projectCategories } = useLoaderData<CreateCampaignLoader>();
  const [isActive, setIsActive] = useState(true);

  return (
    <SectionCard
      title="Dados da campanha"
      description="Informações principais que aparecem na página pública."
    >
      <FormField name="name" label="Nome da campanha" required>
        <Input name="name" placeholder="Ex.: Reforma da Paróquia São José" />
      </FormField>

      <CreateSlugField />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="category" label="Categoria">
          <Select.Root name="category">
            <Select.Trigger>
              <Select.Value placeholder="Selecione a categoria" />
            </Select.Trigger>
            <Select.Content>
              {projectCategories.map((category) => (
                <Select.Item key={category.id} value={category.id}>
                  {category.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </FormField>

        <FormField name="status" label="Status">
          <div className="flex h-10.75 items-center justify-between rounded-[11px] border border-border px-4">
            <span className="text-sm font-semibold text-foreground">
              {isActive ? "Campanha ativa" : "Campanha inativa"}
            </span>
            <input type="hidden" name="status" value={isActive ? "active" : "inactive"} />
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="startDate" label="Data de início">
          <InputGroup.Root>
            <InputGroup.Addon>
              <Calendar size={16} />
            </InputGroup.Addon>
            <InputGroup.Input
              type="date"
              name="startDate"
              className="cursor-pointer bg-muted pl-9"
            />
          </InputGroup.Root>
        </FormField>

        <FormField name="endDate" label="Data de término">
          <InputGroup.Root>
            <InputGroup.Addon>
              <Calendar size={16} />
            </InputGroup.Addon>
            <InputGroup.Input
              type="date"
              name="endDate"
              className="cursor-pointer bg-muted pl-9"
            />
          </InputGroup.Root>
        </FormField>
      </div>

      <div className="flex flex-col gap-1">
        <FormField name="phone" label="WhatsApp do responsável pela campanha">
          <Input name="phone" type="tel" placeholder="(11) 90000-0000" />
        </FormField>
        <p className="text-xs text-muted-foreground">
          Usado para avisos e comunicação interna. Não é exibido publicamente.
        </p>
      </div>
    </SectionCard>
  );
}

export { CampaignDataSection };
