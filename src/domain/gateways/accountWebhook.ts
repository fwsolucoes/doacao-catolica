import type { AccountWebhook } from "../entities/accountWebhook";

type AccountWebhookInput = {
  url: string;
  /** "*" assina todos os eventos, inclusive futuros. */
  events: string[];
};

/** Campos opcionais — para ativar/desativar, envie só `active`. */
type UpdateAccountWebhookInput = Partial<AccountWebhookInput & { active: boolean }>;

type AccountWebhookGatewayDTO = {
  listAccountWebhooks(accountReference: string): Promise<AccountWebhook[]>;
  createAccountWebhook(
    accountReference: string,
    input: AccountWebhookInput,
  ): Promise<void>;
  updateAccountWebhook(
    webhookId: string,
    input: UpdateAccountWebhookInput,
  ): Promise<void>;
  deleteAccountWebhook(webhookId: string): Promise<void>;
};

export type {
  AccountWebhookGatewayDTO,
  AccountWebhookInput,
  UpdateAccountWebhookInput,
};
