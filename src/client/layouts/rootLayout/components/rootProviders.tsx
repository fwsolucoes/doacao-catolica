import {
  DrawerProvider,
  ModalProvider,
  ToastProvider,
} from "@arkyn/components";
import type { ReactNode } from "react";
import { ThemeProvider } from "~/client/hooks/useTheme";

type RootProviderArgs = {
  children: ReactNode;
};

function RootProviders({ children }: RootProviderArgs) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DrawerProvider>
          <ModalProvider>{children}</ModalProvider>
        </DrawerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export { RootProviders };
