type ActiveFundraiser = {
  id: string;
  initials: string;
  name: string;
  email: string;
};

type PendingFundraiser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  status: string;
};

export type { ActiveFundraiser, PendingFundraiser };
