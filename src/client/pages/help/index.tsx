import {
  ArrowUpRight,
  BookOpen,
  Bug,
  Check,
  Clock,
  Heart,
  Lightbulb,
  MessageSquareWarning,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { cn } from "~/lib/utils";

const TUTORIALS_URL = "https://ajuda.doacaocatolica.com";
const SUPPORT_PHONE_DISPLAY = "+55 32 2021-2800";
const SUPPORT_WHATSAPP_URL = "https://wa.me/553220212800";

function whatsappUrl(message: string) {
  return `${SUPPORT_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

const SCHEDULE = [
  { label: "Segunda a sexta", hours: "08h às 18h" },
  { label: "Sábado", hours: "08h às 12h" },
];

const TUTORIAL_TOPICS = [
  "Criar campanhas",
  "Gerir doações",
  "Ler relatórios",
  "Configurar integrações",
];

const FEEDBACK_OPTIONS: {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  message: string;
}[] = [
  {
    title: "Reportar um erro",
    description: "Algo não funcionou como esperado?",
    icon: Bug,
    iconClassName: "bg-red-600/10 text-red-600",
    message: "Olá! Gostaria de reportar um erro na plataforma.",
  },
  {
    title: "Enviar sugestão",
    description: "Tem uma ideia para melhorar?",
    icon: Lightbulb,
    iconClassName: "bg-sky-700/10 text-sky-700",
    message: "Olá! Gostaria de enviar uma sugestão para a plataforma.",
  },
  {
    title: "Elogios",
    description: "Quer elogiar o nosso atendimento?",
    icon: Heart,
    iconClassName: "bg-emerald-700/10 text-emerald-700",
    message: "Olá! Gostaria de deixar um elogio.",
  },
  {
    title: "Reclamações",
    description: "Algo no serviço precisa melhorar?",
    icon: MessageSquareWarning,
    iconClassName: "bg-amber-600/10 text-amber-600",
    message: "Olá! Gostaria de registrar uma reclamação.",
  },
];

function IconTile({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-13 shrink-0 items-center justify-center rounded-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  return (
    <Card.Root className="relative overflow-hidden rounded-2xl p-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(219,222,235,0.65)_1px,transparent_1px),linear-gradient(to_bottom,rgba(219,222,235,0.65)_1px,transparent_1px)] bg-size-[34px_34px] [mask-image:linear-gradient(to_right,black,transparent_80%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-34 -right-24 size-86 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Badge className="self-start border border-primary/20 bg-primary/5 px-3.5 text-primary uppercase tracking-[0.16em]">
            <Sparkles size={16} data-icon="inline-start" />
            Central de Ajuda
          </Badge>

          <div className="flex flex-col gap-3.5">
            <h1 className="text-3xl font-semibold tracking-tight text-(--text-heading) sm:text-[40px] sm:leading-tight">
              Estamos aqui para ajudar você
            </h1>
            <p className="max-w-144 text-[15px] leading-relaxed text-muted-foreground">
              Consulte tutoriais passo a passo, fale com a nossa equipe no
              horário comercial ou envie um retorno sobre a sua experiência na
              plataforma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 pt-1">
            <Button asChild size="lg" className="px-7 text-base">
              <a href={TUTORIALS_URL} target="_blank" rel="noreferrer">
                <BookOpen size={20} />
                Acessar tutoriais
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#2e9052]/30 bg-muted px-7 text-base text-(--text-heading)"
            >
              <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={20} className="text-[#2e9052]" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-3.5 rounded-2xl border border-border bg-muted/70 p-6">
          <div className="flex items-center gap-2.5 text-primary">
            <Clock size={20} />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Horário de atendimento
            </span>
          </div>
          <div className="flex gap-3">
            {SCHEDULE.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col gap-1 rounded-xl border border-border bg-card/70 p-3.5"
              >
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-[15px] font-semibold text-(--text-heading)">
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Card.Root>
  );
}

function TutorialsCard() {
  return (
    <Card.Root className="flex-1 justify-between gap-8 rounded-2xl">
      <div className="flex flex-col gap-6">
        <IconTile className="bg-primary/10 text-primary">
          <BookOpen size={24} />
        </IconTile>

        <div className="flex flex-col gap-2">
          <h2 className="text-[19px] font-semibold tracking-tight text-(--text-heading)">
            Central de Tutoriais
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Guias passo a passo e respostas rápidas para você tirar o melhor
            proveito da plataforma.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TUTORIAL_TOPICS.map((topic) => (
            <li key={topic} className="flex items-center gap-2.5 text-muted-foreground">
              <Check size={20} className="shrink-0 text-primary" />
              {topic}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <span className="rounded-xl bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
          ajuda.doacaocatolica.com
        </span>
        <Button asChild className="px-5 text-base">
          <a href={TUTORIALS_URL} target="_blank" rel="noreferrer">
            Acessar central
            <ArrowUpRight size={20} />
          </a>
        </Button>
      </div>
    </Card.Root>
  );
}

function SupportCard() {
  return (
    <Card.Root className="flex-1 justify-between gap-8 rounded-2xl border-[#2e9052]/25">
      <div className="flex flex-col gap-6">
        <IconTile className="bg-[#2e9052]/10 text-[#2e9052]">
          <WhatsAppIcon size={24} />
        </IconTile>

        <div className="flex flex-col gap-2">
          <h2 className="text-[19px] font-semibold tracking-tight text-(--text-heading)">
            Falar com o Suporte
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Nossa equipe atende pelo WhatsApp em horário comercial: segunda a
            sexta, de 08h às 18h, e sábado, de 08h às 12h.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-muted px-5 py-5.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            WhatsApp de suporte
          </span>
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xl font-semibold tracking-tight text-(--text-heading) hover:underline"
          >
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <Button asChild size="lg" className="w-full bg-[#2e9052] text-base text-white">
        <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={20} />
          Iniciar conversa no WhatsApp
        </a>
      </Button>
    </Card.Root>
  );
}

function FeedbackSection() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-(--text-heading)">
          Envie um retorno
        </h2>
        <p className="text-muted-foreground">
          A sua opinião ajuda a melhorar a plataforma. Escolha uma das opções
          abaixo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {FEEDBACK_OPTIONS.map(({ title, description, icon: Icon, iconClassName, message }) => (
          <a
            key={title}
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Card.Root className="h-full justify-between gap-6 rounded-2xl p-6 transition-colors group-hover:border-primary/40">
              <div className="flex flex-col gap-3.5">
                <IconTile className={iconClassName}>
                  <Icon size={24} />
                </IconTile>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold tracking-tight text-(--text-heading)">
                    {title}
                  </span>
                  <span className="text-muted-foreground">{description}</span>
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-primary">
                Clique para enviar
                <ArrowUpRight size={16} />
              </span>
            </Card.Root>
          </a>
        ))}
      </div>
    </section>
  );
}

function HelpPage() {
  return (
    <div className="mx-auto flex w-full max-w-288 flex-col gap-9.5">
      <HeroSection />

      <section className="flex flex-col gap-6 lg:flex-row">
        <TutorialsCard />
        <SupportCard />
      </section>

      <FeedbackSection />
    </div>
  );
}

export { HelpPage };
