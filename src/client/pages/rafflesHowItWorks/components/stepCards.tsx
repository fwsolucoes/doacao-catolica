import { BellRing, ListChecks, Sparkles, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { Card } from "~/client/components/ui/card";

const stepIcon = tv({
  base: "flex size-11 shrink-0 items-center justify-center rounded-xl",
  variants: {
    color: {
      navy: "bg-(--badge-navy-bg) text-(--badge-navy-text)",
      amber: "bg-(--badge-amber-bg) text-(--badge-amber-text)",
      emerald: "bg-(--badge-emerald-bg) text-(--badge-emerald-text)",
      violet: "bg-(--badge-violet-bg) text-(--badge-violet-text)",
    },
  },
});

type Step = {
  icon: LucideIcon;
  color: "navy" | "amber" | "emerald" | "violet";
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: Sparkles,
    color: "navy",
    title: "Ative o sorteio quando quiser",
    description:
      "Um sorteio pode ser ativado a qualquer momento, tanto em uma campanha nova quanto em uma campanha que já está no ar. Basta cadastrar o sorteio e deixá-lo ativo.",
  },
  {
    icon: ListChecks,
    color: "amber",
    title: "Defina o bilhete e a numeração",
    description:
      "No cadastro você informa o valor do bilhete e o número inicial e final. Essa faixa define quantos bilhetes existem no sorteio.",
  },
  {
    icon: Ticket,
    color: "emerald",
    title: "Toda doação vira bilhetes",
    description:
      "Sempre que alguém fizer uma doação — recorrente ou pontual — ela recebe bilhetes de acordo com o valor da doação e o valor do bilhete. Não é preciso comprar nada à parte.",
  },
  {
    icon: BellRing,
    color: "violet",
    title: "Confirmação no WhatsApp",
    description:
      "Os bilhetes podem ser disparados por WhatsApp para os números cadastrados, usando a mensagem do tipo Confirmação de Pagamento (Sorteios). Essa mensagem precisa ser configurada na Régua de Mensagens: sem ela, nada é enviado ao confirmar o pagamento.",
  },
];

function StepCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {STEPS.map(({ icon: Icon, color, title, description }, index) => (
        <Card.Root key={title} className="flex-row items-start gap-4 p-6">
          <div className={stepIcon({ color })}>
            <Icon size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Passo {index + 1}
            </span>
            <h2 className="font-semibold text-(--text-heading)">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </Card.Root>
      ))}
    </div>
  );
}

export { StepCards };
