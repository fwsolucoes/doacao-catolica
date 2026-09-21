import type { ReactNode } from "react";

import { ProgressBar } from "~/client/components/progressBar";
import { Toaster } from "~/client/components/ui/sonner";

import { PermissionToast } from "./components/permissionToast";
import { RootDocument } from "./components/rootDocument";
import { RootProviders } from "./components/rootProviders";

import { rootLinks } from "./meta/links";
import { rootMeta } from "./meta/meta";

type RootLayoutProps = {
  children: ReactNode;
};

function RootLayout({ children }: RootLayoutProps) {
  return (
    <RootProviders>
      <RootDocument>
        <ProgressBar />
        <Toaster position="top-right" />
        <PermissionToast />
        {children}
      </RootDocument>
    </RootProviders>
  );
}

export { RootLayout, rootLinks, rootMeta };
