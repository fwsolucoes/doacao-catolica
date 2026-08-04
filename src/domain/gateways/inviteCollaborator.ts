import { SearchResult } from "~/app/shared/searchResult";
import type { InviteCollaborator } from "../entities/inviteCollaborator";

type CreateInviteCollaboratorInput = {
  projectId: string;
  inviterId: number;
  invitedUserEmail: string;
  invitedUserRoleId: string;
};

type UpdateInviteCollaboratorInput = {
  id: string;
  roleId: string;
};

type AcceptInvitationInput = {
  userEmail: string;
  projectId: string;
  roleId: string;
};

type InviteCollaboratorGatewayDTO = {
  createInviteCollaborator: (
    input: CreateInviteCollaboratorInput,
    token: string,
  ) => Promise<void>;
  updateInviteCollaborator: (
    input: UpdateInviteCollaboratorInput,
    token: string,
  ) => Promise<void>;
  deleteInviteCollaborator: (id: string, token: string) => Promise<void>;
  resendInviteCollaborator: (id: string, token: string) => Promise<void>;
  listInviteCollaborators: (
    campaignId: string,
    token: string,
  ) => Promise<SearchResult<InviteCollaborator>>;
  acceptInvitation: (
    input: AcceptInvitationInput,
    token: string,
  ) => Promise<void>;
  declineInvitation: (id: string, token: string) => Promise<void>;
};

export type {
  AcceptInvitationInput,
  CreateInviteCollaboratorInput,
  InviteCollaboratorGatewayDTO,
  UpdateInviteCollaboratorInput,
};
