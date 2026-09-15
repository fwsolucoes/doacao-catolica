import { z } from "zod";

const acceptInvitationSchema = z.object({
  userEmail: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  roleId: z.string().min(1, "Função obrigatória"),
  projectId: z.string().min(1, "O id do projeto é obrigatório"),
});

const declineInvitationSchema = z.object({
  id: z.string().uuid(),
});

const acceptAmbassadorInvitationSchema = z.object({
  projectId: z.string().min(1, "O id do projeto é obrigatório"),
  inviteId: z.string().min(1, "O id do convite é obrigatório"),
});

export {
  acceptAmbassadorInvitationSchema,
  acceptInvitationSchema,
  declineInvitationSchema,
};
