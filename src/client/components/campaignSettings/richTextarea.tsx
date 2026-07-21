import { Bold, Italic } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/client/components/ui/button";
import { cn } from "~/lib/utils";

type RichTextareaProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
};

function RichTextarea({ name, placeholder, defaultValue }: RichTextareaProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  function syncHidden() {
    if (hiddenRef.current && editorRef.current) {
      hiddenRef.current.value = editorRef.current.innerHTML;
    }
  }

  function format(command: string) {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncHidden();
  }

  return (
    <div className="overflow-hidden rounded-[11px] border border-border bg-muted">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => format("bold")}
        >
          <Bold size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => format("italic")}
        >
          <Italic size={15} />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHidden}
        className={cn(
          "min-h-28 p-3 text-sm outline-none",
          "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
        )}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: defaultValue ?? "" }}
      />
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export { RichTextarea };
