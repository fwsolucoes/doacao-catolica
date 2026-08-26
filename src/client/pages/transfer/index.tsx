import { TransferHeader } from "./components/header";
import { TransfersTable } from "./components/transfersTable";

function TransferPage() {
  return (
    <div className="flex flex-col gap-5">
      <TransferHeader />
      <TransfersTable />
    </div>
  );
}

export { TransferPage };
