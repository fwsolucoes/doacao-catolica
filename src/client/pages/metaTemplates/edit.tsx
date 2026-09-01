import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "~/client/components/ui/button";
import { ButtonCard } from "./components/ButtonCard";
import { GeneralCard } from "./components/GeneralCard";
import { HeaderCard } from "./components/HeaderCard";
import { VariablesCard } from "./components/VariablesCard";

function EditMetaTemplatePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const backPath = `/campaign/${campaignId}/meta-templates`;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" className="mt-1 shrink-0" asChild>
          <Link to={backPath}>
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Editar template
          </h1>
          <p className="text-base text-muted-foreground">
            Configure o template aprovado na Meta, o cabeçalho, as variáveis e o botão.
          </p>
        </div>
      </div>

      <GeneralCard />
      <HeaderCard />
      <VariablesCard />
      <ButtonCard />
    </div>
  );
}

export { EditMetaTemplatePage };
