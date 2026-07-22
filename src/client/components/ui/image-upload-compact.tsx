import { ImageIcon, Loader2, RefreshCw, Upload } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { cn } from "~/client/lib/utils";
import { Button } from "./button";
import { FormErrorContext, FormFieldContext } from "./form-field";

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

type ImageUploadCompactProps = {
  name: string;
  defaultValue?: string | null;
  width?: number;
  height?: number;
  reduceQuality?: number;
  disabled?: boolean;
  description?: string;
};

function ImageUploadCompact({
  name,
  defaultValue,
  width,
  height,
  reduceQuality,
  disabled = false,
  description,
}: ImageUploadCompactProps) {
  const fieldName = use(FormFieldContext);
  const fieldErrors = use(FormErrorContext);
  const hasFieldError = !!fieldErrors[fieldName]?.length;

  const [value, setValue] = useState(defaultValue ?? "");
  const [filePath, setFilePath] = useState<string | null>(defaultValue || null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  async function doUpload(file: File): Promise<string> {
    const params = new URLSearchParams();
    if (width) params.set("w", String(width));
    if (height) params.set("h", String(height));
    if (reduceQuality) params.set("reduceQuality", String(reduceQuality));

    const queryString = params.toString();
    const uploadUrl = `/api/file-upload${queryString ? `?${queryString}` : ""}`;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(uploadUrl, { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok || !data?.url) {
      throw new Error(data?.error ?? "Erro ao enviar imagem. Tente novamente.");
    }

    return data.url as string;
  }

  async function handleFile(file: File) {
    if (disabled || isLoading) return;

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setUploadError("Formato não suportado. Envie JPG, PNG, WebP ou GIF.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;

    setFilePath(localUrl);
    setPendingFile(file);
    setIsLoading(true);
    setUploadError(null);

    try {
      const url = await doUpload(file);
      setValue(url);
      setFilePath(url);
      URL.revokeObjectURL(localUrl);
      objectUrlRef.current = null;
      setPendingFile(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erro ao enviar imagem. Tente novamente.",
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
      setFilePath(url);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPendingFile(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erro ao enviar imagem. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openFilePicker() {
    if (disabled || isLoading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ACCEPTED_MIME_TYPES.join(",");
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }

  const hasError = hasFieldError || !!uploadError;

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={value} />

      <div
        className={cn(
          "flex items-center gap-5 rounded-2xl border border-dashed border-border p-5",
          hasError && "border-destructive",
        )}
      >
        {/* Preview */}
        <div className="relative flex h-20 w-34 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
          {isLoading ? (
            <Loader2 size={22} className="animate-spin text-muted-foreground" />
          ) : filePath ? (
            <img src={filePath} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImageIcon size={26} className="text-muted-foreground/40" />
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Enviando...</p>
          ) : uploadError ? (
            <p className="text-sm font-medium text-destructive">{uploadError}</p>
          ) : filePath ? (
            <p className="text-sm font-semibold text-foreground">Imagem carregada</p>
          ) : (
            <p className="text-sm font-semibold text-foreground">Envie uma imagem</p>
          )}
          {description && !uploadError && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Action */}
        {uploadError && pendingFile ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={disabled || isLoading}
            onClick={handleReSend}
          >
            <RefreshCw size={15} />
            Reenviar
          </Button>
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
            {filePath ? "Alterar" : "Enviar"}
          </Button>
        )}
      </div>
    </div>
  );
}

export { ImageUploadCompact };
export type { ImageUploadCompactProps };
