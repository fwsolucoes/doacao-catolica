import { Check, Headphones, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/client/components/ui/button";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";

type WhatsAppOption = "official" | "own";

function ActiveBadge() {
  return (
    <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-xl bg-sidebar-primary px-3 py-1 text-xs font-semibold text-white">
      <Check size={11} strokeWidth={3} />
      Ativo
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

function SelectedButton() {
  return (
    <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6e6ed] text-sm font-semibold text-foreground">
      <Check size={15} />
      Selecionado
    </div>
  );
}

function OfficialNumberCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col rounded-2xl border p-px transition-colors",
        selected
          ? "border-sidebar-primary bg-sidebar-primary/[0.03]"
          : "border-border bg-card",
      )}
    >
      {selected && <ActiveBadge />}

      {/* Header */}
      <div className="flex items-start gap-3.5 px-7 pb-3.5 pt-10">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <MessageCircle size={22} className="text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Número oficial Doação Católica
            </span>
            <span className="rounded-xl bg-[#e6e6ed] px-3 py-0.5 text-xs font-semibold text-foreground">
              Recomendado
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Use o número oficial da plataforma. Sem burocracia, sem precisar de
            chip ou aparelho próprio.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-7 pb-7">
        <div className="flex flex-col gap-2.5">
          <BulletItem text="Ativação imediata, sem configuração técnica" />
          <BulletItem text="Entrega garantida pelo WhatsApp Business API" />
          <BulletItem text="Cobrança por mensagem enviada (R$ 0,05 a R$ 0,40)" />
        </div>

        <div className="mt-auto flex flex-col gap-3.5 pt-2.5">
          <p className="text-xs text-muted-foreground">
            Você paga apenas pelas mensagens efetivamente enviadas.
          </p>
          {selected ? (
            <SelectedButton />
          ) : (
            <Button type="button" className="w-full" onClick={onSelect}>
              Usar número oficial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function OwnNumberCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col rounded-2xl border p-px transition-colors",
        selected
          ? "border-sidebar-primary bg-sidebar-primary/[0.03]"
          : "border-border bg-card",
      )}
    >
      {selected && <ActiveBadge />}

      {/* Header */}
      <div className="flex items-start gap-3.5 px-7 pb-3.5 pt-10">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
          <Phone size={22} className="text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Número próprio
          </span>
          <p className="text-sm text-muted-foreground">
            Conecte um número exclusivo da sua paróquia ou instituição, com a
            sua identidade nas mensagens.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-7 pb-7">
        <div className="flex flex-col gap-2.5">
          <BulletItem text="Identidade própria (nome e foto do seu número)" />
          <BulletItem text="Requer contratação de um plano dedicado" />
          <BulletItem text="Atendimento e configuração feitos pelo time comercial" />
        </div>

        <div className="flex flex-col gap-3.5 pt-2.5">
          <Button type="button" variant="outline" size="sm" className="w-full gap-2">
            <Headphones size={15} />
            Falar com o time comercial
          </Button>
          {selected ? (
            <SelectedButton />
          ) : (
            <Button type="button" className="w-full" onClick={onSelect}>
              Quero um número próprio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CampaignWhatsappPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);
  const [selectedOption, setSelectedOption] = useState<WhatsAppOption>("official");

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

      <div className="flex items-start gap-8">
        <StepNav steps={steps} />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Conexão WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground">
              Escolha como sua campanha vai enviar mensagens e lembretes pelo
              WhatsApp.
            </p>
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
      </div>
    </div>
  );
}

export { CampaignWhatsappPage };
