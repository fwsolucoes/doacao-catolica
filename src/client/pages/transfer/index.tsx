import { useMemo } from "react";
import { useLoaderData } from "react-router";
import type { TransfersLoader } from "~/client/types/transfersLoader";
import { TransferHeader } from "./components/header";
import { TransfersTable } from "./components/transfersTable";

function TransferPage() {
  const { transfers, transferMetrics, transferAccounts, subAccounts } =
    useLoaderData<TransfersLoader>();

  const availableAmount = transferMetrics.balanceAvailable;
  const awaitingRelease = Math.max(
    transferMetrics.totalReceived - transferMetrics.balanceAvailable,
    0,
  );

  const accounts = useMemo(
    () =>
      transferAccounts.data.filter(
        (account) => account.pixKey && account.pixType,
      ),
    [transferAccounts.data],
  );

  return (
    <div className="flex flex-col gap-5">
      <TransferHeader
        accounts={accounts}
        availableAmount={availableAmount}
        awaitingRelease={awaitingRelease}
        withdrawalsMade={transferMetrics.withdrawalsMade}
      />
      <TransfersTable transfers={transfers} />
    </div>
  );
}

export { TransferPage };
