import { Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormField, FormErrorProvider } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { RadioGroup } from "~/client/components/ui/radio-group";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { InviteSentModal } from "./inviteSentModal";

type AddCollaboratorModalProps = {
  open: boolean;
  onClose: () => void;
};

function AddCollaboratorModal({ open, onClose }: AddCollaboratorModalProps) {
  const { projectRoles } = useLoaderData<CollaboratorsLoader>();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(projectRoles[0]?.id ?? "");
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      setSuccessOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setSubmittedEmail(String(formData.get("userEmail") ?? "").trim());
  }

  function handleSuccessConfirm() {
    setSuccessOpen(false);
    setSubmittedEmail("");
    formRef.current?.reset();
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-132">
          <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
            <DialogTitle className="text-xl">Adicionar colaborador</DialogTitle>
            <p className="text-base text-muted-foreground">
              Envie um convite por e-mail e defina a função de acesso.
            </p>
          </DialogHeader>

          <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
            <fetcher.Form
              ref={formRef}
              method="post"
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleSubmit}
            >
              <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-8 pb-6">
                <FormField name="userEmail" label="E-mail" required>
                  <Input
                    name="userEmail"
                    type="email"
                    placeholder="colaborador@exemplo.com"
                  />
                </FormField>

                <FormField name="roleId" label="Função" required>
                  <RadioGroup.Root
                    name="roleId"
                    value={selectedRoleId}
                    onValueChange={setSelectedRoleId}
                    className="flex flex-col gap-4"
                  >
                    {projectRoles.map((role) => (
                      <label
                        key={role.id}
                        className="flex cursor-pointer gap-4 rounded-xl border border-border p-4 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                      >
                        <RadioGroup.Item value={role.id} className="mt-1" />
                        <span className="flex flex-col gap-2">
                          <span className="text-base font-semibold text-foreground">
                            {role.name}
                          </span>
                          <span className="text-sm leading-6 text-muted-foreground">
                            {role.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </RadioGroup.Root>
                </FormField>
              </div>

              <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  name="_action"
                  value="createInviteCollaborator"
                  disabled={isSubmitting || !selectedRoleId}
                  isLoading={isSubmitting}
                  className="gap-2"
                >
                  <Send size={16} />
                  Enviar convite
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </FormErrorProvider>
        </DialogContent>
      </Dialog>

      <InviteSentModal
        open={successOpen}
        email={submittedEmail}
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
}

export { AddCollaboratorModal };
