import { Image, Upload } from "lucide-react";
import { useState } from "react";

type FileUploadFieldProps = {
  name: string;
  label: string;
  optional?: boolean;
  hint?: string;
  currentValue?: string | null;
};

function FileUploadField({
  name,
  label,
  optional,
  hint,
  currentValue,
}: FileUploadFieldProps) {
  const [filename, setFilename] = useState<string | null>(
    currentValue ? (currentValue.split("/").pop() ?? currentValue) : null,
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {optional && (
          <span className="text-xs text-muted-foreground">(opcional)</span>
        )}
      </div>
      <label className="flex cursor-pointer items-center gap-3.5 rounded-[11px] border border-dashed border-border bg-muted p-[15px] transition-colors hover:bg-muted/70">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[11px] bg-background">
          <Image size={19} className="text-muted-foreground" />
        </div>
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {filename ?? "Clique para enviar uma imagem"}
        </span>
        <div className="flex shrink-0 items-center gap-1.5 rounded-[11px] border border-border bg-background px-3 py-1.5">
          <Upload size={15} className="text-foreground" />
          <span className="text-xs font-semibold text-foreground">
            Selecionar
          </span>
        </div>
        <input
          type="file"
          name={name}
          className="sr-only"
          accept="image/*"
          onChange={(e) =>
            setFilename(e.target.files?.[0]?.name ?? null)
          }
        />
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export { FileUploadField };
