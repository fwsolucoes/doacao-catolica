import { z } from "zod";

const createInviteCollaboratorSchema = z.object({
  userEmail: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  roleId: z.string().min(1, "Função obrigatória"),
});

const updateInviteCollaboratorSchema = z.object({
  roleId: z.string().min(1, "Função obrigatória"),
});

const deleteInviteCollaboratorSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

const resendInviteCollaboratorSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

const cancelInviteCollaboratorSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

export {
  cancelInviteCollaboratorSchema,
  createInviteCollaboratorSchema,
  deleteInviteCollaboratorSchema,
  resendInviteCollaboratorSchema,
  updateInviteCollaboratorSchema,
};
