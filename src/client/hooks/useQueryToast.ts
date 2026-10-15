import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useScopedParams } from "~/lib/scopedParams";

type UseQueryToastOptions = {
  param: string;
  value?: string; // opcional (default: "true")
  message: string;
  type?: "success" | "danger";
};

function useQueryToast({
  param,
  value = "true",
  message,
  type = "success",
}: UseQueryToastOptions) {
  const location = useLocation();
  const navigate = useNavigate();

  const scopedParams = useScopedParams(location.search);
  const paramValue = scopedParams.getParam(param);

  const hasShown = useRef(false);

  useEffect(() => {
    if (paramValue === value && !hasShown.current) {
      hasShown.current = true;

      if (type === "danger") {
        toast.error(message);
      } else {
        toast.success(message);
      }

      const params = new URLSearchParams(location.search);
      params.delete(param);

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true },
      );
    }
  }, [paramValue, value, message, type, location, navigate]);
}

export { useQueryToast };
