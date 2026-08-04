import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import type { CollaboratorRole } from "./types";

const ROLE_TONES: CollaboratorRole["tone"][] = ["emerald", "navy", "violet"];

function getInitials(name: string, email: string): string {
  const base = name.trim() || email.split("@")[0] || email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatStatus(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending") return "Pendente";
  if (normalized === "accepted") return "Aceito";
  if (normalized === "rejected") return "Recusado";
  return status;
}

function getRoleTone(name: string, index: number): CollaboratorRole["tone"] {
  const normalizedName = name.trim().toLowerCase();
  if (normalizedName.includes("supervisor")) return "violet";
  if (normalizedName.includes("finance")) return "navy";
  if (normalizedName.includes("relacionamento")) return "emerald";
  return ROLE_TONES[index % ROLE_TONES.length];
}

function buildRolesById(
  projectRoles: CollaboratorsLoader["projectRoles"],
): Map<string, CollaboratorRole> {
  const roles: CollaboratorRole[] = projectRoles.map((role, index) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tone: getRoleTone(role.name, index),
  }));
  return new Map(roles.map((role) => [role.id, role]));
}

export { buildRolesById, formatStatus, getInitials, getRoleTone };
