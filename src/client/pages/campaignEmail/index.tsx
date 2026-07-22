import { Code2, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import {
  buildSteps,
  StepNav,
  StepTabBar,
} from "~/client/components/campaignSettings/stepNav";
import { NewLayoutDialog } from "./components/newLayoutDialog";

type EmailLayout = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

const SAMPLE_LAYOUTS: EmailLayout[] = [
  {
    id: "1",
    name: "Layout básico",
    description: "Layout simples e clean para qualquer tipo de mensagem",
    createdAt: "10/01/2024",
  },
  {
    id: "2",
    name: "Layout moderno",
    description: "Design moderno com gradiente e espaçamento amplo",
    createdAt: "15/01/2024",
  },
  {
    id: "3",
    name: "Layout profissional",
    description: "Estilo corporativo com barra lateral",
    createdAt: "01/02/2024",
  },
];

function LayoutCard({ layout }: { layout: EmailLayout }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex h-40 items-center justify-center bg-muted">
        <Code2 size={48} className="text-muted-foreground/40" />
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">{layout.name}</p>
          <p className="text-xs text-muted-foreground">{layout.description}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Criado em {layout.createdAt}
        </p>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-9 flex-1 gap-2">
            <Eye size={15} />
            Visualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-9 p-0 text-muted-foreground"
          >
            <Pencil size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-9 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function VariablesBanner() {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
      <span className="text-sm font-semibold text-blue-900">
        Variáveis disponíveis:
      </span>
      <span className="text-sm text-blue-800">Use</span>
      <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sm text-blue-600">
        {"{{imagem_1}}"}
      </code>
      <span className="text-sm text-blue-800">,</span>
      <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sm text-blue-600">
        {"{{imagem_2}}"}
      </code>
      <span className="text-sm text-blue-800">e</span>
      <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sm text-blue-600">
        {"{{corpo_email}}"}
      </code>
      <span className="text-sm text-blue-800">em seu HTML.</span>
    </div>
  );
}

function CampaignEmailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const steps = buildSteps(campaignId!);
  const [newLayoutOpen, setNewLayoutOpen] = useState(false);

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
          {/* Remetente */}
          <SectionCard
            title="Remetente"
            description="Como os emails aparecem na caixa de entrada dos doadores."
          >
            <FormField name="senderName" label="Nome do remetente" required>
              <Input
                name="senderName"
                placeholder="Ex.: Educação para Todos"
              />
            </FormField>
            <FormField name="replyTo" label="Responder para (opcional)">
              <Input
                name="replyTo"
                type="email"
                placeholder="atendimento@suainstituicao.org"
              />
            </FormField>
          </SectionCard>

          {/* Layouts de e-mail */}
          <Card.Root className="flex flex-col gap-0 p-0">
            <div className="flex items-start justify-between gap-4 p-7">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Layouts de e-mail
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure layouts HTML reutilizáveis para seus emails.
                </p>
              </div>
              <Button className="shrink-0" onClick={() => setNewLayoutOpen(true)}>
                <Plus size={15} />
                Novo layout
              </Button>
            </div>

            <div className="flex flex-col gap-5 px-7 pb-7">
              <VariablesBanner />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {SAMPLE_LAYOUTS.map((layout) => (
                  <LayoutCard key={layout.id} layout={layout} />
                ))}
              </div>
            </div>
          </Card.Root>

          <div className="flex justify-end">
            <Button type="button" disabled>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>

      <NewLayoutDialog
        open={newLayoutOpen}
        onClose={() => setNewLayoutOpen(false)}
      />
    </div>
  );
}

export { CampaignEmailPage };
