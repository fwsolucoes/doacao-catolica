import { Image, Loader2, RefreshCw, Upload } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { FormErrorContext, FormFieldContext } from "./form-field";

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_FORMATS_LABEL = "JPG, PNG, WebP ou GIF";

type ImageUploadProps = {
  name: string;
  defaultValue?: string | null;
  width?: number;
  height?: number;
  reduceQuality?: number;
  disabled?: boolean;
};

function ImageUpload({
  name,
  defaultValue,
  width,
  height,
  reduceQuality,
  disabled = false,
}: ImageUploadProps) {
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
      setUploadError(`Formato não suportado. Envie uma imagem ${ACCEPTED_FORMATS_LABEL}.`);
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

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled || isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const hasError = hasFieldError || !!uploadError;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input type="hidden" name={name} value={value} />

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-invalid={hasFieldError || undefined}
        className={cn(
          "relative flex h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted transition-colors",
          hasError && "border-destructive",
        )}
      >
        {isLoading && (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Enviando...</span>
          </div>
        )}

        {!isLoading && !filePath && (
          <div className="flex w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Image size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clique para enviar ou arraste aqui
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={openFilePicker}
            >
              <Upload size={14} />
              Selecionar
            </Button>
          </div>
        )}

        {!isLoading && filePath && (
          <>
            <img
              src={filePath}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/40 px-3 py-3">
              {uploadError && pendingFile ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={disabled}
                  onClick={handleReSend}
                  className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
                  variant="outline"
                >
                  <RefreshCw size={14} />
                  Reenviar
                </Button>
              ) : (
                <span />
              )}
              <Button
                type="button"
                size="sm"
                disabled={disabled}
                onClick={openFilePicker}
                className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
                variant="outline"
              >
                <Upload size={14} />
                Alterar imagem
              </Button>
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-xs font-medium text-destructive">{uploadError}</p>
      )}
    </div>
  );
}

export { ImageUpload };
export type { ImageUploadProps };
