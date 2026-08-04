import { useEffect, useState } from "react";
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
import { RadioGroup } from "~/client/components/ui/radio-group";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import type { ActiveCollaborator } from "./types";

type ChangeRoleModalProps = {
  collaborator: ActiveCollaborator | null;
  onClose: () => void;
};

function ChangeRoleModal({ collaborator, onClose }: ChangeRoleModalProps) {
  const { projectRoles } = useLoaderData<CollaboratorsLoader>();
  const fetcher = useFetcher();
  const [selectedRoleId, setSelectedRoleId] = useState(collaborator?.role.id ?? "");
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (collaborator) setSelectedRoleId(collaborator.role.id);
  }, [collaborator]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      onClose();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={!!collaborator} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-132">
        <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Alterar função</DialogTitle>
          <p className="text-base text-muted-foreground">
            Atualize a função de acesso de {collaborator?.name}.
          </p>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            method="post"
            className="flex min-h-0 flex-1 flex-col"
          >
            <input type="hidden" name="Id" value={collaborator?.id ?? ""} />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 pb-6">
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
                value="updateInviteCollaborator"
                disabled={
                  isSubmitting ||
                  !selectedRoleId ||
                  selectedRoleId === collaborator?.role.id
                }
                isLoading={isSubmitting}
              >
                Salvar alteração
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { ChangeRoleModal };
