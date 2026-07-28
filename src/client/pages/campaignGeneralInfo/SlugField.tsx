import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useFetcher } from "react-router";
import { generateSlug } from "~/lib/generateSlug";
import { Button } from "~/client/components/ui/button";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";
import { cn } from "~/lib/utils";

type SlugFieldProps = {
  campaignId: string;
  slugPrefix: string;
  defaultSlug: string;
};

function SlugField({ campaignId, slugPrefix, defaultSlug }: SlugFieldProps) {
  const slugFetcher = useFetcher<{ available: boolean }>();
  const isVerifying = slugFetcher.state === "submitting";
  const [currentSlugValue, setCurrentSlugValue] = useState(defaultSlug);
  const [lastVerifiedSlug, setLastVerifiedSlug] = useState<string | null>(null);
  const slugResult =
    slugFetcher.data !== undefined && currentSlugValue === lastVerifiedSlug
      ? slugFetcher.data
      : null;

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentSlugValue(generateSlug(e.target.value));
  }

  return (
    <div className="flex flex-col gap-2">
      <slugFetcher.Form
        id="verify-slug-form"
        method="post"
        action={`/campaign/${campaignId}/settings/general-info`}
        onSubmit={() => setLastVerifiedSlug(currentSlugValue)}
      >
        <input type="hidden" name="slug" value={currentSlugValue} />
      </slugFetcher.Form>

      <FormField name="slug" label="Slug (URL)">
        <div className="flex items-center gap-2.5">
          <InputGroup.Root className="flex-1">
            <InputGroup.Side>{slugPrefix}</InputGroup.Side>
            <InputGroup.Input
              name="slug"
              placeholder="minha-campanha"
              value={currentSlugValue}
              onChange={handleSlugChange}
              className="focus-visible:ring-0"
            />
          </InputGroup.Root>
          <Button
            type="submit"
            form="verify-slug-form"
            name="_action"
            value="verifySlug"
            variant="outline"
            className="h-9.5 shrink-0 rounded-[11px] text-xs"
            disabled={isVerifying}
          >
            {isVerifying ? "Verificando..." : "Verificar"}
          </Button>
        </div>
      </FormField>

      {slugResult !== null && (
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs",
            slugResult.available ? "text-emerald-600" : "text-destructive",
          )}
        >
          <CheckCircle2 size={17} className="shrink-0" />
          <span>
            {slugResult.available
              ? "Slug disponível"
              : "Este slug já está em uso"}
          </span>
        </div>
      )}
    </div>
  );
}

export { SlugField };
