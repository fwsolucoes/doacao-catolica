import { useEffect } from "react";

import { useRoot } from "~/client/hooks/useRoot";

function Produktly() {
  const token = useRoot()?.environmentVariables?.PRODUKTLY_TOKEN;

  useEffect(() => {
    if (!token) return;

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://public.produktly.com/js/main.js";
    script.id = "produktlyScript";
    script.dataset.clientToken = token;
    head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [token]);

  return null;
}

export { Produktly };
