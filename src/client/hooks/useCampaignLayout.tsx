import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useMatches } from "react-router";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";

type PermissionType = (typeof PROJECT_ALL_PERMISSIONS)[number];

type CampaignLayoutContextType = {
  isPermissionGranted: (permission: PermissionType) => boolean;
};

const CampaignLayoutContext = createContext<CampaignLayoutContextType>(
  {} as CampaignLayoutContextType,
);

function useCampaignLayout() {
  const contextData = useContext(CampaignLayoutContext);
  if (Object.entries(contextData).length === 0) {
    throw new Error(
      "useCampaignLayout must be used within a CampaignLayoutProvider",
    );
  }
  return contextData;
}

const CampaignLayoutProvider = ({ children }: { children: ReactNode }) => {
  const matches = useMatches();
  const match = matches.find(
    (m) => m.id === "main/routes/layout.campaignLayout",
  );

  function isPermissionGranted(permission: PermissionType) {
    if (!match) throw new Error("CampaignLayoutProvider: route match not found");
    const { projectPermissions } = match.data as CampaignLayoutLoader;
    return projectPermissions.includes(permission);
  }

  return (
    <CampaignLayoutContext.Provider value={{ isPermissionGranted }}>
      {children}
    </CampaignLayoutContext.Provider>
  );
};

export { CampaignLayoutProvider, useCampaignLayout };
