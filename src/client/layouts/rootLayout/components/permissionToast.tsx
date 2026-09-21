import { useEffect } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";

function PermissionToast() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("noPermission") !== "true") return;
    toast.error("Você não tem permissão para acessar esta campanha.");
    params.delete("noPermission");
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
