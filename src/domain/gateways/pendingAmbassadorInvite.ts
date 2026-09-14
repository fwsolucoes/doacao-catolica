import type { PendingInvite } from "../entities/pendingInvite";

type PendingAmbassadorInvitesResult = {
  items: PendingInvite[];
};

type PendingAmbassadorInviteGatewayDTO = {
  findAll(email: string, token: string): Promise<PendingAmbassadorInvitesResult>;
};

export type { PendingAmbassadorInviteGatewayDTO, PendingAmbassadorInvitesResult };
