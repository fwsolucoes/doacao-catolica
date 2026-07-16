type CollaboratorRole = {
  id: string;
  name: string;
  description: string;
  tone: "violet" | "emerald" | "navy";
};

type ActiveCollaborator = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: CollaboratorRole;
};

type PendingCollaborator = {
  id: string;
  initials: string;
  email: string;
  role: CollaboratorRole;
  invitedAt: string;
};

export type { ActiveCollaborator, CollaboratorRole, PendingCollaborator };
