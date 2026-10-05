type UpdateDonationAccountGoalsInput = {
  totalGoal: number | null;
  monthlyGoal: number | null;
};

type DonationAccountGatewayDTO = {
  updateGoals: (
    accountUuid: string,
    input: UpdateDonationAccountGoalsInput,
  ) => Promise<void>;
};

export type { DonationAccountGatewayDTO, UpdateDonationAccountGoalsInput };
