import { File, Loader2, RefreshCw, Upload } from "lucide-react";
import { use, useState } from "react";
import { cn } from "~/client/lib/utils";
import { Button } from "./button";
import { FormErrorContext, FormFieldContext } from "./form-field";

/**
 * Representa um tipo de arquivo aceito pelo FileUploadCompact.
 * - `mime`: tipo MIME enviado pelo navegador (usado para validar o arquivo selecionado)
 * - `extension`: extensão com ponto (usada no `accept` do file picker e na mensagem de erro)
 */
type AcceptedFileType = {
  mime: string;
  extension: string;
};

/**
 * Todos os tipos de documento comuns suportados pelo componente.
 * Exportado para permitir filtragem via `.filter()`.
 *
 * @example Aceitar apenas PDF e DOC
 * ```tsx
 * accept={DOCUMENT_TYPES.filter((t) => [".pdf", ".doc"].includes(t.extension))}
 * ```
 *
 * @example Aceitar apenas PDF
 * ```tsx
 * accept={DOCUMENT_TYPES.filter((t) => t.extension === ".pdf")}
 * ```
 */
const DOCUMENT_TYPES: AcceptedFileType[] = [
  { mime: "application/pdf", extension: ".pdf" },
  { mime: "application/msword", extension: ".doc" },
  { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extension: ".docx" },
  { mime: "application/vnd.ms-excel", extension: ".xls" },
  { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: ".xlsx" },
  { mime: "application/vnd.ms-powerpoint", extension: ".ppt" },
  { mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extension: ".pptx" },
  { mime: "text/plain", extension: ".txt" },
  { mime: "text/csv", extension: ".csv" },
];

/**
 * Componente de upload de arquivo compacto. Faz POST para `/api/file-upload`,
 * recebe a URL do S3 e a armazena em um `<input type="hidden">` com o `name` fornecido.
 *
 * @example Uso básico — aceita todos os tipos de documento
 * ```tsx
 * <FileUploadCompact name="anexo" description="Contrato em qualquer formato." />
 * ```
 *
 * @example Restringir a PDF e DOC
 * ```tsx
 * import { FileUploadCompact, DOCUMENT_TYPES } from "~/client/components/ui/file-upload-compact";
 *
 * <FileUploadCompact
 *   name="contrato"
 *   accept={DOCUMENT_TYPES.filter((t) => [".pdf", ".doc"].includes(t.extension))}
 * />
 * ```
 *
 * @example Com valor padrão (edição)
 * ```tsx
 * <FileUploadCompact name="contrato" defaultValue={template.contractUrl} />
 * ```
 *
 * Dentro de um `FormField`, erros de servidor aparecem automaticamente via contexto.
 */
type FileUploadCompactProps = {
  name: string;
  defaultValue?: string | null;
  disabled?: boolean;
  description?: string;
  /** Tipos de arquivo aceitos. Padrão: todos os tipos em `DOCUMENT_TYPES`. */
  accept?: AcceptedFileType[];
};

function FileUploadCompact({
  name,
  defaultValue,
  disabled = false,
  description,
  accept = DOCUMENT_TYPES,
}: FileUploadCompactProps) {
  const fieldName = use(FormFieldContext);
  const fieldErrors = use(FormErrorContext);
  const hasFieldError = !!fieldErrors[fieldName]?.length;

  const acceptedMimes = accept.map((t) => t.mime);
  const acceptedExtensions = accept.map((t) => t.extension).join(",");

  const [value, setValue] = useState(defaultValue ?? "");
  const [fileName, setFileName] = useState<string | null>(() => {
    if (!defaultValue) return null;
    try {
      const pathname = new URL(defaultValue).pathname;
      const segment = decodeURIComponent(pathname.split("/").pop() ?? "");
      // New key format: {uuid(36)}-{sanitized-name} — strip the UUID prefix
      return (segment.length > 37 && segment[36] === "-" ? segment.slice(37) : segment) || null;
    } catch {
      const segment = defaultValue.split("/").pop() ?? "";
      return (segment.length > 37 && segment[36] === "-" ? segment.slice(37) : segment) || null;
    }
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function doUpload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/file-upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok || !data?.url) {
      throw new Error(data?.error ?? "Erro ao enviar arquivo. Tente novamente.");
    }
    return data.url as string;
  }

  async function handleFile(file: File) {
    if (disabled || isLoading) return;

    if (!acceptedMimes.includes(file.type)) {
      const extensions = accept.map((t) => t.extension.replace(".", "").toUpperCase()).join(", ");
      setUploadError(`Formato não suportado. Envie: ${extensions}.`);
      return;
    }

    setPendingFile(file);
    setFileName(file.name);
    setIsLoading(true);
    setUploadError(null);

    try {
      const url = await doUpload(file);
      setValue(url);
      setPendingFile(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erro ao enviar arquivo. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReSend() {
    if (!pendingFile || isLoading) return;
    setIsLoading(true);
    setUploadError(null);
    try {
      const url = await doUpload(pendingFile);
      setValue(url);
      setPendingFile(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erro ao enviar arquivo. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openFilePicker() {
    if (disabled || isLoading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedExtensions;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }

  const hasError = hasFieldError || !!uploadError;
  const isUploaded = !!value && !pendingFile;

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={value} />

      <div
        className={cn(
          "flex items-center gap-5 rounded-2xl border border-dashed border-border p-5",
          hasError && "border-destructive",
        )}
      >
        {/* Icon */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted">
          {isLoading ? (
            <Loader2 size={22} className="animate-spin text-muted-foreground" />
          ) : (
            <File
              size={26}
              className={cn(
                "text-muted-foreground/40",
                (isUploaded || pendingFile) && "text-primary",
              )}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Enviando...</p>
          ) : uploadError ? (
            <p className="text-sm font-medium text-destructive">{uploadError}</p>
          ) : fileName ? (
            <>
              <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">Arquivo carregado</p>
            </>
          ) : (
            <p className="text-sm font-semibold text-foreground">Envie um documento</p>
          )}
          {description && !uploadError && !fileName && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Action */}
        {uploadError && pendingFile ? (
          <div className="flex shrink-0 flex-col gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isLoading}
              onClick={handleReSend}
            >
              <RefreshCw size={15} />
              Reenviar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || isLoading}
              onClick={openFilePicker}
            >
              <Upload size={15} />
              Trocar arquivo
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={disabled || isLoading}
            onClick={openFilePicker}
          >
            <Upload size={15} />
            {fileName ? "Alterar" : "Enviar"}
          </Button>
        )}
      </div>
    </div>
  );
}

export { FileUploadCompact, DOCUMENT_TYPES };
export type { FileUploadCompactProps, AcceptedFileType };
