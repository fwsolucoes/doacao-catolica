import { HandCoins, RefreshCw, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { cn } from "~/lib/utils";
import { DisableRecurrenceDialog } from "./disableRecurrenceDialog";
import { DonorsFilterDrawer } from "./donorsFilterDrawer";
import { EnableRecurrenceDialog } from "./enableRecurrenceDialog";
import { GenerateBookletDialog } from "./generateBookletDialog";
import { GenerateUpcomingPaymentsDialog } from "./generateUpcomingPaymentsDialog";
import { UpdateRecurrenceDialog } from "./updateRecurrenceDialog";
import { RecurringDonorsTable } from "./recurringDonorsTable";
import { OneTimeDonorsTable } from "./oneTimeDonorsTable";

type Tab = "recorrentes" | "pontuais";

type DonorRow = DonorsLoader["donors"]["data"][number];

type DialogState =
  | { type: "updateRecurrence"; donor: DonorRow }
  | { type: "generateUpcoming"; subscriptionUuid: string }
  | { type: "generateBooklet"; subscriptionUuid: string }
  | { type: "disableRecurrence"; subscriptionUuid: string; name: string }
  | { type: "enableRecurrence"; subscriptionUuid: string; name: string }
  | null;

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count: number;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto flex-1 gap-2 rounded-xl px-3.5 py-2 text-sm font-normal sm:flex-none",
        active
          ? "bg-card text-foreground font-semibold shadow-sm hover:bg-card"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="hidden sm:inline">{label}</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs",
          active
            ? "bg-muted text-foreground"
            : "bg-muted/70 text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Button>
  );
}

function DonorsTable() {
  const { donors, summary, oneTimeDonors, currentUrl } =
    useLoaderData<DonorsLoader>();
  const [dialog, setDialog] = useState<DialogState>(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get("tab") ?? "recorrentes") as Tab;
  const searchValue = searchParams.get("donor_search") ?? "";

  function handleTabChange(tab: Tab) {
    const params = new URLSearchParams(location.search);
    if (tab === "recorrentes") params.delete("tab");
    else params.set("tab", tab);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  }

  function handleSearch(value: string) {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (value) params.set("donor_search", value);
      else params.delete("donor_search");
      params.delete("page");
      navigate(`${location.pathname}?${params.toString()}`);
    }, 500);
  }

  return (
    <>
      <Card.Root className="gap-4 p-6">
        <div className="flex w-full items-center gap-1 rounded-xl border border-border bg-muted/60 p-1.5 sm:w-fit">
          <TabButton
            active={activeTab === "recorrentes"}
            onClick={() => handleTabChange("recorrentes")}
            icon={RefreshCw}
            label="Doadores recorrentes"
            count={summary.recurringDonors}
          />
          <TabButton
            active={activeTab === "pontuais"}
            onClick={() => handleTabChange("pontuais")}
            icon={HandCoins}
            label="Doadores pontuais"
            count={summary.oneTimeDonors}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              className="h-11 rounded-xl border-transparent bg-muted/50"
              defaultValue={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <DonorsFilterDrawer />
        </div>

        {activeTab === "recorrentes" ? (
          <RecurringDonorsTable
            donors={donors}
            searchValue={searchValue}
            setDialog={setDialog}
          />
        ) : (
          oneTimeDonors && (
            <OneTimeDonorsTable
              oneTimeDonors={oneTimeDonors}
              currentUrl={currentUrl}
              searchValue={searchValue}
            />
          )
        )}
      </Card.Root>

      <UpdateRecurrenceDialog
        donor={dialog?.type === "updateRecurrence" ? dialog.donor : null}
        onClose={closeDialog}
      />
      <GenerateUpcomingPaymentsDialog
        subscriptionUuid={
          dialog?.type === "generateUpcoming" ? dialog.subscriptionUuid : null
        }
        onClose={closeDialog}
      />
      <DisableRecurrenceDialog
        subscriptionUuid={
          dialog?.type === "disableRecurrence" ? dialog.subscriptionUuid : null
        }
        name={dialog?.type === "disableRecurrence" ? dialog.name : ""}
        onClose={closeDialog}
      />
      <EnableRecurrenceDialog
        subscriptionUuid={
          dialog?.type === "enableRecurrence" ? dialog.subscriptionUuid : null
        }
        name={dialog?.type === "enableRecurrence" ? dialog.name : ""}
        onClose={closeDialog}
      />
      <GenerateBookletDialog
        subscriptionUuid={
          dialog?.type === "generateBooklet" ? dialog.subscriptionUuid : null
        }
        onClose={closeDialog}
      />
    </>
  );
}

export type { DonorRow, DialogState };
export { DonorsTable };
