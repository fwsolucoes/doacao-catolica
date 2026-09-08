import { CircleCheck, CircleSlash } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import type { CampaignWhatsappLoader } from "~/client/types/campaignWhatsappLoader";
import { OfficialNumberCard } from "./official-number-card";
import { OwnNumberCard } from "./own-number-card";

type WhatsAppOption = "official" | "own";

function WhatsAppConnectionSection() {
  const settings = useLoaderData<CampaignWhatsappLoader>();

  const [selectedOption, setSelectedOption] = useState<WhatsAppOption | null>(
    () => {
      if (settings === null) return null;
      return settings.type === "custom" ? "own" : "official";
    },
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Conexão WhatsApp
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolha como sua campanha vai enviar mensagens e lembretes pelo
            WhatsApp.
          </p>
        </div>
        {settings?.active === true ? (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3.5 py-1 text-sm font-semibold text-emerald-700">
            <CircleCheck size={16} />
            Conexão ativa
          </div>
        ) : settings === null ? (
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1 text-sm font-semibold text-muted-foreground">
            <CircleSlash size={16} />
            Conexão não configurada
          </div>
        ) : null}
      </div>

      <div className="flex items-stretch gap-5">
        <OfficialNumberCard
          selected={selectedOption === "official"}
          onSelect={() => setSelectedOption("official")}
        />
        <OwnNumberCard
          selected={selectedOption === "own"}
          onSelect={() => setSelectedOption("own")}
        />
      </div>
    </div>
  );
}

export { WhatsAppConnectionSection };
