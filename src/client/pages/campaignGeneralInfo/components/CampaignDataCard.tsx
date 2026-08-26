import { useState, type ReactNode } from "react";
import { Calendar } from "lucide-react";
import type { Value } from "react-phone-number-input";
import { useLoaderData, useParams } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { InputGroup } from "~/client/components/ui/input-group";
import { PhoneInput } from "~/client/components/ui/phone-input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { SlugField } from "../SlugField";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {children}
    </Card.Root>
  );
}

function CampaignDataCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();

  const { campaignId } = useParams<{ campaignId: string }>();

  const { SANCTON_DONATION_CHECKOUT_URL } = useRoot().environmentVariables;

  const slugPrefix = SANCTON_DONATION_CHECKOUT_URL.endsWith("/")
    ? SANCTON_DONATION_CHECKOUT_URL
    : `${SANCTON_DONATION_CHECKOUT_URL}/`;

  const [isActive, setIsActive] = useState(campaign.status);
  const [phone, setPhone] = useState<Value | "">(campaign.phone ?? "");

  const startDateValue = campaign.startDateInput ?? "";

  const endDateValue = campaign.endDateInput ?? "";

  return (
    <SectionCard title="Dados da Campanha">
      <FormField name="name" label="Nome da Campanha" required>
        <Input
          name="name"
          placeholder="Ex.: Educação para Todos"
          defaultValue={campaign.name}
        />
      </FormField>

      <SlugField
        campaignId={campaignId!}
        slugPrefix={slugPrefix}
        defaultSlug={campaign.slug}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField name="category" label="Categoria">
          <Select.Root name="category" defaultValue="paroquia">
            <Select.Trigger>
              <Select.Value placeholder="Selecione a categoria" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="paroquia">Paróquia</Select.Item>
              <Select.Item value="comunidade">Comunidade</Select.Item>
              <Select.Item value="missao">Missão</Select.Item>
              <Select.Item value="outro">Outro</Select.Item>
              <Select.Item value="dizimo">Dízimo</Select.Item>
              <Select.Item value="apostolado">Apostolado</Select.Item>
              <Select.Item value="obras-e-reformas">
                Obras e Reformas
              </Select.Item>
              <Select.Item value="acao-social">Ação social</Select.Item>
              <Select.Item value="evento">Evento</Select.Item>
            </Select.Content>
          </Select.Root>
        </FormField>

        <FormField name="status" label="Status">
          <div className="flex h-10.75 items-center justify-between rounded-md border border-border bg-muted px-4">
            <span className="text-sm font-semibold text-foreground">
              {isActive ? "Campanha ativa" : "Campanha inativa"}
            </span>
            <input
              type="hidden"
              name="status"
              value={isActive ? "active" : "inactive"}
            />
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
              defaultValue={startDateValue}
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
              defaultValue={endDateValue}
              className="cursor-pointer bg-muted pl-9"
            />
          </InputGroup.Root>
        </FormField>
      </div>

      <div className="flex flex-col gap-1">
        <FormField name="phone" label="WhatsApp do responsável pela campanha">
          <input type="hidden" name="phone" value={phone} />
          <PhoneInput
            defaultCountry="BR"
            value={phone}
            onChange={(v) => setPhone(v || "")}
          />
        </FormField>
        <p className="text-xs text-muted-foreground">
          Usado para avisos e comunicação interna. Não é exibido publicamente.
        </p>
      </div>
    </SectionCard>
  );
}

export { CampaignDataCard };
