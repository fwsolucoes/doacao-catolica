import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useFetcher } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { generateSlug } from "~/lib/generateSlug";
import { Button } from "~/client/components/ui/button";
import { FormField } from "~/client/components/ui/form-field";
import { InputGroup } from "~/client/components/ui/input-group";
import { cn } from "~/lib/utils";

function CreateSlugField() {
  const { SANCTON_DONATION_CHECKOUT_URL } = useRoot().environmentVariables;
  const slugPrefix = SANCTON_DONATION_CHECKOUT_URL.endsWith("/")
    ? SANCTON_DONATION_CHECKOUT_URL
    : `${SANCTON_DONATION_CHECKOUT_URL}/`;
  const slugFetcher = useFetcher<{ available: boolean }>();
  const isVerifying = slugFetcher.state === "submitting";
  const [currentSlug, setCurrentSlug] = useState("");
  const [lastVerifiedSlug, setLastVerifiedSlug] = useState<string | null>(null);
  const slugResult =
    slugFetcher.data !== undefined && currentSlug === lastVerifiedSlug
      ? slugFetcher.data
      : null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentSlug(generateSlug(e.target.value));
  }

  function handleVerify() {
    setLastVerifiedSlug(currentSlug);
    slugFetcher.submit(
      { slug: currentSlug, _action: "verifySlug" },
      { method: "post", action: "/my-campaigns/create" },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FormField name="slug" label="Slug (URL)">
        <div className="flex items-center gap-2.5">
          <InputGroup.Root className="flex-1">
            <InputGroup.Side>{slugPrefix}</InputGroup.Side>
            <InputGroup.Input
              name="slug"
              placeholder="minha-campanha"
              value={currentSlug}
              onChange={handleChange}
              className="focus-visible:ring-0"
            />
          </InputGroup.Root>
          <Button
            type="button"
            onClick={handleVerify}
            variant="outline"
            className="h-9.5 shrink-0 rounded-[11px] text-xs"
            disabled={isVerifying || !currentSlug}
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
          {slugResult.available ? (
            <CheckCircle2 size={17} className="shrink-0" />
          ) : (
            <XCircle size={17} className="shrink-0" />
          )}
          <span>
            {slugResult.available ? "Slug disponível" : "Este slug já está em uso"}
          </span>
        </div>
      )}
    </div>
  );
}

export { CreateSlugField };
