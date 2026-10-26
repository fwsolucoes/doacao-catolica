import { formatToHiddenDigits } from "@arkyn/shared";
import { useLoaderData } from "react-router";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { WalletUpgradeNotice } from "./WalletUpgradeNotice";
import { FormField } from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import type { CreateCampaignLoader } from "~/client/types/createCampaignLoader";

function DigitalWalletSection() {
  const { subAccounts } = useLoaderData<CreateCampaignLoader>();

  if (subAccounts.data.length === 0) {
    return (
      <SectionCard title="Carteira digital">
        <WalletUpgradeNotice />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Carteira digital"
      description="Selecione a carteira que receberá os valores das doações desta campanha."
    >
      <FormField name="subAccountId" label="Carteira para recebimento" required>
        <Select.Root name="subAccountId" required>
          <Select.Trigger>
            <Select.Value placeholder="Selecione uma carteira" />
          </Select.Trigger>
          <Select.Content>
            {subAccounts.data.map(({ subAccountId, name, cpfCnpj }) => (
              <Select.Item key={subAccountId} value={subAccountId}>
                {`${name} - (${formatToHiddenDigits(cpfCnpj, { hider: "•", range: [3, 6] })})`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </FormField>
    </SectionCard>
  );
}

export { DigitalWalletSection };
