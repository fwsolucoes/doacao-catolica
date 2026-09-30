import { useMatches } from "react-router";
import type { RootLoaderType } from "~/client/types/rootLoader";

function useRoot() {
  const matches = useMatches();
  const rootData = matches[0].loaderData as RootLoaderType;

  return rootData;
}

export { useRoot };
