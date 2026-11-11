import { environmentVariables } from "~/main/config/environmentVariables";
import type { User } from "~/main/types/user";

function parseAllowedUserIds(raw: string): Set<string> {
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  );
}

function resolveGeneralReportsAccountId(user: User): number {
  const allowedUserIds = parseAllowedUserIds(
    environmentVariables.GENERAL_REPORTS_ALLOWED_USER_IDS,
  );
  const masterAccountId = environmentVariables.GENERAL_REPORTS_MASTER_ACCOUNT_ID;

  if (allowedUserIds.has(user.id) && masterAccountId) {
    return Number(masterAccountId);
  }

  return user.accountId;
}

export { resolveGeneralReportsAccountId };
