import type { SearchResult } from "~/app/shared/searchResult";
import type { TransferAccount } from "../entities/transferAccount";

type CreateTransferAccountInput = {
  accountId: number;
  pixType: string;
  pixKey: string;
  type: number;
  token: string;
};

type RequestWithdrawalInput = {
  accountUuid: string;
  amount: number;
  pix: {
    key: string;
    type: string;
    scheduleDate: string;
  };
};

type TransferAccountGatewayDTO = {
  createTransferAccount(input: CreateTransferAccountInput): Promise<void>;
  listTransferAccounts(
    accountId: number,
    token: string,
  ): Promise<SearchResult<TransferAccount>>;
  requestWithdrawal(input: RequestWithdrawalInput): Promise<void>;
};

export type {
  CreateTransferAccountInput,
  RequestWithdrawalInput,
  TransferAccountGatewayDTO,
};
