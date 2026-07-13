import { z } from "zod";
import { paginationSchema } from "./pagination";

const listCollaboratorsSchema = paginationSchema.extend({
  name: z.string().optional(),
});

const listInvitesSchema = paginationSchema;

type CreateInviteType = z.infer<typeof createInviteSchema>;
type AcceptInviteType = z.infer<typeof acceptInviteSchema>;
type UpdateInviteType = z.infer<typeof updateInviteSchema>;
type UpdateCollaboratorType = z.infer<typeof updateCollaboratorSchema>;
type DeleteInviteType = z.infer<typeof deleteInviteSchema>;
type DeleteCollaboratorType = z.infer<typeof deleteCollaboratorSchema>;

const createInviteSchema = z
  .object({
    organizationId: z.uuid(),
    invitedByUserId: z.uuid(),
    email: z.email("Informe um e-mail válido"),
    roleId: z.uuid("A função é obrigatória"),
    name: z.string().optional(),
    avatar: z.string().optional(),
    professionalRegistry: z.string().optional(),
    activityAreaId: z.string().optional(),
    specialtyId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "O nome é obrigatório",
      });
    }

    if (!data.avatar) {
      ctx.addIssue({
        code: "custom",
        path: ["avatar"],
        message: "A foto é obrigatória",
      });
    }

    if (!data.professionalRegistry) {
      ctx.addIssue({
        code: "custom",
        path: ["professionalRegistry"],
        message: "O registro profissional é obrigatório",
      });
    }

    if (!data.activityAreaId) {
      ctx.addIssue({
        code: "custom",
        path: ["activityAreaId"],
        message: "A área de atuação é obrigatória",
      });
    }

    if (!data.specialtyId) {
      ctx.addIssue({
        code: "custom",
        path: ["specialtyId"],
        message: "A especialidade é obrigatória",
      });
    }
  });

const updateInviteSchema = z
  .object({
    id: z.uuid("O colaborador é obrigatório"),
    email: z.email("Informe um e-mail válido"),
    roleId: z.uuid("A função é obrigatória"),
    name: z.string().optional(),
    avatar: z.string().optional(),
    professionalRegistry: z.string().optional(),
    activityAreaId: z.string().optional(),
    specialtyId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "O nome é obrigatório",
      });
    }

    if (!data.avatar) {
      ctx.addIssue({
        code: "custom",
        path: ["avatar"],
        message: "A foto é obrigatória",
      });
    }

    if (!data.professionalRegistry) {
      ctx.addIssue({
        code: "custom",
        path: ["professionalRegistry"],
        message: "O registro profissional é obrigatório",
      });
    }

    if (!data.activityAreaId) {
      ctx.addIssue({
        code: "custom",
        path: ["activityAreaId"],
        message: "A área de atuação é obrigatória",
      });
    }

    if (!data.specialtyId) {
      ctx.addIssue({
        code: "custom",
        path: ["specialtyId"],
        message: "A especialidade é obrigatória",
      });
    }
  });

const updateCollaboratorSchema = z
  .object({
    id: z.uuid("O colaborador é obrigatório"),
    roleId: z.uuid("A função é obrigatória"),
    name: z.string().optional(),
    avatar: z.string().optional(),
    professionalRegistry: z.string().optional(),
    activityAreaId: z.string().optional(),
    specialtyId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "O nome é obrigatório",
      });
    }

    if (!data.avatar) {
      ctx.addIssue({
        code: "custom",
        path: ["avatar"],
        message: "A foto é obrigatória",
      });
    }

    if (!data.professionalRegistry) {
      ctx.addIssue({
        code: "custom",
        path: ["professionalRegistry"],
        message: "O registro profissional é obrigatório",
      });
    }

    if (!data.activityAreaId) {
      ctx.addIssue({
        code: "custom",
        path: ["activityAreaId"],
        message: "A área de atuação é obrigatória",
      });
    }

    if (!data.specialtyId) {
      ctx.addIssue({
        code: "custom",
        path: ["specialtyId"],
        message: "A especialidade é obrigatória",
      });
    }
  });

const acceptInviteSchema = z.object({
  response: z.enum(["ACCEPT", "REFUSE"]),
  userId: z.uuid("O usuário é obrigatório"),
});

const deleteInviteSchema = z.object({
  id: z.uuid("O convite é obrigatório"),
});

const deleteCollaboratorSchema = z.object({
  id: z.uuid("O colaborador é obrigatório"),
});

export {
  acceptInviteSchema,
  createInviteSchema,
  deleteCollaboratorSchema,
  deleteInviteSchema,
  listCollaboratorsSchema,
  listInvitesSchema,
  updateCollaboratorSchema,
  updateInviteSchema,
  type AcceptInviteType,
  type CreateInviteType,
  type DeleteCollaboratorType,
  type DeleteInviteType,
  type UpdateCollaboratorType,
  type UpdateInviteType,
};
