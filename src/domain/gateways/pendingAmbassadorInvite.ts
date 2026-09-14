import type { PendingInvite } from "../entities/pendingInvite";

type PendingAmbassadorInvitesResult = {
  items: PendingInvite[];
};

type AcceptAmbassadorInvitationInput = {
  userEmail: string;
  projectId: string;
};

type PendingAmbassadorInviteGatewayDTO = {
  findAll(email: string, token: string): Promise<PendingAmbassadorInvitesResult>;
  acceptInvitation(input: AcceptAmbassadorInvitationInput, token: string): Promise<void>;
};

export type {
  AcceptAmbassadorInvitationInput,
  PendingAmbassadorInviteGatewayDTO,
  PendingAmbassadorInvitesResult,
};
