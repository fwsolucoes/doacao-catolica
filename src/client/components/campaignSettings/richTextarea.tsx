import { Bold, Italic, Underline } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ToggleGroup } from "~/client/components/ui/toggle-group";
import { cn } from "~/lib/utils";

type RichTextareaRef = {
  insertAtCursor: (text: string) => void;
};

type RichTextareaProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
};

const RichTextarea = forwardRef<RichTextareaRef, RichTextareaProps>(
  function RichTextarea({ name, placeholder, defaultValue, onChange }, ref) {
    const editorRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLInputElement>(null);
    const savedRangeRef = useRef<Range | null>(null);
    const [activeFormats, setActiveFormats] = useState<string[]>([]);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultValue ?? "";
      }
    }, []);

    function syncHidden() {
      if (hiddenRef.current && editorRef.current) {
        hiddenRef.current.value = editorRef.current.innerHTML;
      }
    }

    function updateActiveFormats() {
      const formats: string[] = [];
      if (document.queryCommandState("bold")) formats.push("bold");
      if (document.queryCommandState("italic")) formats.push("italic");
      if (document.queryCommandState("underline")) formats.push("underline");
      setActiveFormats(formats);
    }

    function applyFormat(newFormats: string[]) {
      const toToggle = [
        ...newFormats.filter((f) => !activeFormats.includes(f)),
        ...activeFormats.filter((f) => !newFormats.includes(f)),
      ];
      editorRef.current?.focus();
      toToggle.forEach((cmd) => document.execCommand(cmd, false));
      syncHidden();
      updateActiveFormats();
      onChange?.(editorRef.current?.innerHTML ?? "");
    }

    useImperativeHandle(ref, () => ({
      insertAtCursor(text: string) {
        editorRef.current?.focus();
        const selection = window.getSelection();
        if (!selection) return;
        const range = savedRangeRef.current ?? (selection.rangeCount > 0 ? selection.getRangeAt(0) : null);
        if (!range) return;
        selection.removeAllRanges();
        selection.addRange(range);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        savedRangeRef.current = range.cloneRange();
        syncHidden();
        onChange?.(editorRef.current?.innerHTML ?? "");
      },
    }));

    return (
      <div className="overflow-hidden rounded-[11px] border border-border bg-muted">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          <ToggleGroup.Root
            type="multiple"
            value={activeFormats}
            onValueChange={applyFormat}
            className="gap-0.5"
          >
            <ToggleGroup.Item value="bold" variant="icon" aria-label="Negrito">
              <Bold size={15} />
            </ToggleGroup.Item>
            <ToggleGroup.Item value="italic" variant="icon" aria-label="Itálico">
              <Italic size={15} />
            </ToggleGroup.Item>
            <ToggleGroup.Item value="underline" variant="icon" aria-label="Sublinhado">
              <Underline size={15} />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            syncHidden();
            onChange?.(editorRef.current?.innerHTML ?? "");
          }}
          onBlur={() => {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }
          }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onSelect={updateActiveFormats}
          className={cn(
            "min-h-28 p-3 text-sm outline-none",
            "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          )}
          data-placeholder={placeholder}
        />
        <input
          ref={hiddenRef}
          type="hidden"
          name={name}
          defaultValue={defaultValue}
        />
      </div>
    );
  },
);

export { RichTextarea, type RichTextareaRef };
