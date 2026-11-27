import type { ReactNode } from "react";
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";

type PermissionType = (typeof PROJECT_ALL_PERMISSIONS)[number];

type CanProps = {
  permission: PermissionType;
  children: ReactNode;
  fallback?: ReactNode;
};

function Can({ permission, children, fallback = null }: CanProps) {
  const { isPermissionGranted } = useCampaignLayout();
  return isPermissionGranted(permission) ? <>{children}</> : <>{fallback}</>;
}

export { Can };
