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
import type { ActiveCollaborator, CollaboratorRole } from "./types";

type ChangeRoleModalProps = {
  collaborator: ActiveCollaborator | null;
  roles: CollaboratorRole[];
  selectedRoleId: string;
  onClose: () => void;
  onSelectedRoleChange: (roleId: string) => void;
};

function ChangeRoleModal({
  collaborator,
  roles,
  selectedRoleId,
  onClose,
  onSelectedRoleChange,
}: ChangeRoleModalProps) {
  return (
    <Dialog open={!!collaborator} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 p-0 sm:max-w-132">
        <DialogHeader className="px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Alterar função</DialogTitle>
          <p className="text-base text-muted-foreground">
            Atualize a função de acesso de {collaborator?.name}.
          </p>
        </DialogHeader>

        <FormErrorProvider>
          <form className="flex flex-col gap-6 px-8 pb-8">
            <FormField name="role" label="Função">
              <RadioGroup.Root
                value={selectedRoleId}
                onValueChange={onSelectedRoleChange}
                className="flex flex-col gap-4"
              >
                {roles.map((role) => (
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

            <DialogFooter className="px-0 pb-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="button" disabled>
                Salvar alteração
              </Button>
            </DialogFooter>
          </form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { ChangeRoleModal };
