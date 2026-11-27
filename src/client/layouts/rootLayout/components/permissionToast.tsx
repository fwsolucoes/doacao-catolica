import { useEffect } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";

function PermissionToast() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasNoPermission = params.get("noPermission") === "true";
    const hasFinancialAccessDenied = params.get("financialAccessDenied") === "true";
    if (!hasNoPermission && !hasFinancialAccessDenied) return;

    if (hasNoPermission) {
      toast.error("Você não tem permissão para acessar esta campanha.");
      params.delete("noPermission");
    }
    if (hasFinancialAccessDenied) {
      toast.error("Você não tem permissão para acessar esta área financeira.");
      params.delete("financialAccessDenied");
    }

    const newSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      newSearch ? `${location.pathname}?${newSearch}` : location.pathname,
    );
  }, [location.search]);

  return null;
}

export { PermissionToast };
