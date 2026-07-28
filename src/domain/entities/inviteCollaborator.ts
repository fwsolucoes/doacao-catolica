type InviteCollaboratorProps = {
  id: string;
  projectId: string;
  inviteStatus: string;
  inviterId: number;
  invitedUserId: number | null;
  invitedUserEmail: string;
  invitedUserName: string;
  invitedUserPhone: string | null;
  invitedUserRoleId: string;
  createdAt: string;
};

class InviteCollaborator {
  readonly id: string;
  readonly projectId: string;
  readonly inviteStatus: string;
  readonly inviterId: number;
  readonly invitedUserId: number | null;
  readonly invitedUserEmail: string;
  readonly invitedUserName: string;
  readonly invitedUserPhone: string | null;
  readonly invitedUserRoleId: string;
  readonly createdAt: string;

  private constructor(props: InviteCollaboratorProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.inviteStatus = props.inviteStatus;
    this.inviterId = props.inviterId;
    this.invitedUserId = props.invitedUserId;
    this.invitedUserEmail = props.invitedUserEmail;
    this.invitedUserName = props.invitedUserName;
    this.invitedUserPhone = props.invitedUserPhone;
    this.invitedUserRoleId = props.invitedUserRoleId;
    this.createdAt = props.createdAt;
  }

  static restore(props: InviteCollaboratorProps): InviteCollaborator {
    return new InviteCollaborator(props);
  }

  toJson() {
    return {
      id: this.id,
      projectId: this.projectId,
      inviteStatus: this.inviteStatus,
      inviterId: this.inviterId,
      invitedUserId: this.invitedUserId,
      invitedUserEmail: this.invitedUserEmail,
      invitedUserName: this.invitedUserName,
      invitedUserPhone: this.invitedUserPhone,
      invitedUserRoleId: this.invitedUserRoleId,
      createdAt: this.createdAt,
    };
  }
}

export { InviteCollaborator };
export type { InviteCollaboratorProps };
