import { useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { useActionToast } from "~/client/hooks/useActionToast";
import { Button } from "~/client/components/ui/button";
import { FileUploadCompact } from "~/client/components/ui/file-upload-compact";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { ImageUploadCompact } from "~/client/components/ui/image-upload-compact";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import type { MetaTemplateEditLoader } from "~/client/types/metaTemplateEditLoader";
import { SectionCard } from "./SectionCard";

const HEADER_TYPES = [
  { value: "none", label: "Sem cabeçalho" },
  { value: "text", label: "Texto" },
  { value: "image", label: "Imagem" },
  { value: "video", label: "Vídeo" },
  { value: "document", label: "Documento" },
];

function HeaderCard() {
  const { template } = useLoaderData<MetaTemplateEditLoader>();
  const fetcher = useFetcher();
  const [headerType, setHeaderType] = useState(template.headerType ?? "none");

  useActionToast(fetcher.data);

  return (
    <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
      <fetcher.Form method="post">
        <input type="hidden" name="header_type" value={headerType} />
        <SectionCard title="Cabeçalho" description="Conteúdo exibido acima da mensagem.">
          <div className="flex flex-col gap-5">
            <FormField name="header_type" label="Tipo do cabeçalho">
              <Select.Root value={headerType} onValueChange={setHeaderType}>
                <Select.Trigger className="w-72">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {HEADER_TYPES.map((t) => (
                    <Select.Item key={t.value} value={t.value}>
                      {t.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </FormField>

            {headerType === "text" && (
              <FormField name="header_text" label="Texto do cabeçalho" required>
                <Input
                  name="header_text"
                  defaultValue={template.headerText}
                  placeholder="Ex: Lembrete de pagamento"
                />
                <p className="text-xs text-muted-foreground">
                  Texto fixo — não são aceitas variáveis no cabeçalho de texto.
                </p>
              </FormField>
            )}

            {headerType === "image" && (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-foreground">Imagem do cabeçalho</p>
                <ImageUploadCompact
                  name="header_image"
                  defaultValue={template.headerType === "image" ? template.headerLink : ""}
                  description="Imagem exibida no cabeçalho da mensagem WhatsApp."
                />
              </div>
            )}

            {headerType === "video" && (
              <FormField name="header_link" label="URL do vídeo" required>
                <Input
                  name="header_link"
                  defaultValue={template.headerType === "video" ? template.headerLink : ""}
                  placeholder="https://exemplo.com/video.mp4"
                />
                <p className="text-xs text-muted-foreground">
                  Link público para o vídeo do cabeçalho
                </p>
              </FormField>
            )}

            {headerType === "document" && (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-foreground">Documento do cabeçalho</p>
                <FileUploadCompact
                  name="header_document"
                  defaultValue={template.headerType === "document" ? template.headerLink : ""}
                  description="PDF, Word, Excel, PowerPoint, TXT ou CSV."
                />
              </div>
            )}

            <Separator />
            <div className="flex justify-end">
              <Button
                type="submit"
                name="_action"
                value="save_header"
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Salvando..." : "Salvar cabeçalho"}
              </Button>
            </div>
          </div>
        </SectionCard>
      </fetcher.Form>
    </FormErrorProvider>
  );
}

export { HeaderCard };
